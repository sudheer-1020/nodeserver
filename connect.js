const http = require("http");
const { MongoClient } = require('mongodb');
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    if (req.url === '/api') {
        async function getMovies(client) {
            const cursor = client.db("movieshub").collection("movies").find({});
            const results = await cursor.toArray();
            //console.log(results);
            const js = (JSON.stringify(results));
            console.log(js);
            res.setHeader("Access-Control-Allow-Origin", '*');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(js);

        };
        async function main() {
            const uri = "mongodb+srv://sudheer:Kotesh%40123@cluster0.nsky9l1.mongodb.net/?retryWrites=true&w=majority"
            const client = new MongoClient(uri);
            try {
                // Connect to the MongoDB cluster
                await client.connect();
                console.log("MongoDB connection happened here")
                await getMovies(client);
            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
                console.log("We closed the connection ")
            }
        }
        main();
    }
    else {
        let fsPath = path.join(__dirname, "public", req.url === '/' ? "index.html" : req.url);
        const extPath = path.extname(fsPath);
        fs.readFile(fsPath, (err, Content) => {

            if (err) {

                if(err.code === "ENOENT"){

                    fs.readFile(path.join(__dirname, "public", "404.html"), (err, content) => {

                        if (err) throw err;

                        res.writeHead(200,  { "content-type": "text/html" });

                        res.end(content, "utf-8");

                    });

                }

                else{

                    res.writeHead(500,  { "content-type": "text/plain" });

                    res.end("Internal Server Error");

                }
            }

            else {
                switch (extPath) {

                    case '.css':

                        contentType = "text/css";

                        break;

                    case '.js':

                        contentType = "text/javascript";

                        break;

                    case '.json':

                        contentType = "application/json";

                        break;

                    case '.html':

                        contentType = "text/html";

                        break;

                    default:

                        contentType = "text/plain";

                }
                res.writeHead(200, { "content-type": contentType });

                res.write(Content, "utf-8");

                res.end();
            }

        })}
    });

const PORT = process.env.PORT || 3797;
server.listen(PORT, () => console.log(`Great our server is running on port ${PORT} `));