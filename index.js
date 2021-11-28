const express = require('express');
var cors = require('cors');
const app = express()
app.use(cors())
const port = process.env.PORT || 3000

const replace = require('replace-in-file');
const bodyParser = require('body-parser');
var randomstring = require("randomstring");
const fse = require('fs-extra')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const del = require('del');

const zl = require("zip-lib");

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// Update project file values
// 1. update app_name
// 2. update config values
app.post('/app/create', (req, res) => {
  
  const app_id = randomstring.generate(12);

  // Create a temp project
  fse.copy('./demo_applications/helloapp', './temp/' + app_id, err => {
    if (err) return console.error(err)
    console.log('New project create sucess!')

        // Update app name
        if(req.body.app_name != undefined && req.body.app_name != "") {
          const app_name_options = {
            files: [
              './temp/'+ app_id +'/views/index.ejs',
              './temp/'+ app_id +'/views/meeting.ejs'
            ],
            from: /main-app-name/g,
            to: req.body.app_name,
          };
        
          replace(app_name_options)
          .then(results => {

              // Update isVideo
              const environment_is_video = {
                files: ['./temp/'+ app_id +'/routes/index.js'],
                from: 'is_enable_video',
                to: req.body.is_video,
              };
              replace(environment_is_video)
              .then(results => {

                // Update share screen
                const environment_screens_share = {
                  files: ['./temp/'+ app_id +'/routes/index.js'],
                  from: 'is_enable_screens_share',
                  to: req.body.is_screen,
                };
                replace(environment_screens_share)
                .then(results => {

                      // Update isReroding
                      const environment_enable_recording = {
                        files: ['./temp/'+ app_id +'/routes/index.js'],
                        from: 'is_enable_recording',
                        to: req.body.is_recording,
                      };
                      replace(environment_enable_recording)
                      .then(results => {

                        // Update Consumer Key
                        const environment_enable_recording = {
                          files: ['./temp/'+ app_id +'/public/javascripts/client.js'],
                          from: 'consumer_key',
                          to: req.body.clientId_value,
                        };
                        replace(environment_enable_recording)
                        .then(results => {

                          // Update Consumer Secret
                          const environment_enable_recording = {
                            files: ['./temp/'+ app_id +'/public/javascripts/client.js'],
                            from: 'consumer_secret',
                            to: req.body.client_secret,
                          };
                          replace(environment_enable_recording)


                                .then(results => {
                                    console.log("Updated app parameters sucess!")

                                    // Create a ZIP file
                                    // create a file to stream archive data to.
                                    zl.archiveFolder("./temp/" + app_id, "./temp/" + app_id + ".zip").then(function () {
                                        console.log("done");

                                        res.setHeader('Content-type','application/zip');
                                        res.sendFile(__dirname + '/temp/'+ app_id +'.zip');


                                    }, function (err) {
                                        console.log(err);
                                    });
                                  

                                })
                                .catch(error => {
                                  console.log("Error")
                                  res.status(500).send(
                                    {
                                      "success": false,
                                      "resposne": "Project create not successfully.",
                                    }
                                  )
                                });



                })
                .catch(error => {
                  console.log("Error")
                  res.status(500).send(
                    {
                      "success": false,
                      "resposne": "clientId_value update not successfully.",
                    }
                  )
                });

              })
              .catch(error => {
                console.log("Error")
                res.status(500).send(
                  {
                    "success": false,
                    "resposne": "clientId_value update not successfully.",
                  }
                )
              });

            })
            .catch(error => {
              console.log("Error")
              res.status(500).send(
                {
                  "success": false,
                  "resposne": "clientId_value update not successfully.",
                }
              )
            });

              })
              .catch(error => {
                console.log("Error")
                res.status(500).send(
                  {
                    "success": false,
                    "resposne": "issuer_value update not successfully.",
                  }
                )
              });

              
          })
        
          .catch(error => {
            console.log("Error")
            res.status(500).send(
              {
                "success": false,
                "resposne": "Files update not successfully.",
              }
            )
          });
        }

  })


})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})