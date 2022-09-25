const fastify = require("fastify");

const app = fastify(
    // {logger: true}
);



const fs = require("fs");
const Database = require("better-sqlite3");
const db = new Database("urls.db");//, {verbose: console.log})
const stmt = db.prepare("SELECT redirect FROM urls WHERE endpoint = ?")
const checker = db.prepare("SELECT endpoint FROM urls WHERE redirect = ?")
const insert = db.prepare("INSERT INTO urls (endpoint, redirect) VALUES (?, ?)");

const {CompressUInt} = require("./compression.js")
let codebase = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
function compress_num(n) { return CompressUInt(n, codebase); }
function get_next_int() {
    let o_num = num = parseInt(fs.readFileSync("./num.txt"));
    while(!!stmt.get(compress_num(num))) {
        num++;
    };
    if(o_num != num - 1) fs.writeFileSync("./num.txt", num.toString());
    return num;
}

function new_url(url) {
    // true -> success
    // false -> error
    if(typeof url != "string") return {
        success: false,
        data: "I don't know what you did but the data sent to the server was not a string"
    }
    if(!/^https?\:\/\//.test(url)) return {
        success: false,
        data: "URL must use the http(s) protocol"
    };
    if(/^https?\:\/\/koma.li/.test(url)) return {
        success: false,
        data: "Why are you redirecting that? It's alraedy a redirect!"
    };
    let check = checker.get(url);
    if(!!check) return {
        success: true,
        data: "koma.li/" + check.endpoint
    };
    
    url = encodeURI(url);
    let next;
    try {
        next = compress_num(
            get_next_int()
        )
    } catch(e) {
        return {
            success: false,
            data: "There was an error compressing the current index; please contact Komali#1647 in his server at discord.gg/QWCcXMe"
        };
    }
    try {
        insert.run(next, url);
    } catch(e) {
        return {
            success: false,
            data: "There was an error inserting your url into the database; please contact Komali#1647 in his server at discord.gg/QWCcXMe"
        };
    }
    return {
        success: true,
        data: "https://koma.li/" + next
    }
}

// app.use(express.json());
const opts = {
    schema: {
      body: {
        type: 'object',
        properties: {
          url: { type: 'string' },
        }
      }
    }
  }
app.post("/_add", (req, res) => {
    if(!req.body.url) return {
        success: false,
        data: "Your request is malformed :("        
    }
    else return new_url(req.body.url);
 })
app.get("/_int", _=>get_next_int())
app.get('/:path([A-Za-z0-9]*)', (req, res) => {
    let db_result = stmt.get(req.params.path);
    if(db_result) {
        
        res.redirect(301, db_result.redirect);
    }
    else { 
        res.type('text/html').send(fs.readFileSync("./404.html"))
    }
})
app.get("/", (req, res) => res.type('text/html').send(fs.readFileSync("./index.html")));
app.listen({ port: 3001 })
app.register(require('@fastify/static'), {
    root: __dirname + "/public",
    prefix: '/',
})
app.setNotFoundHandler((req,res) => {
    res.type('text/html').send(fs.readFileSync("./404.html"))
})

  