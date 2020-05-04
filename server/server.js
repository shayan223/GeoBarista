const express = require("express");
const bodyParser = require("body-parser");
var Parser = require('../FileParse/ppjParse')

function server(client_path) {
  const app = express();

  app.set("port", process.env.PORT || 3001);

  // SQLite DB components
  const dbHandler = require('./db-handler');
  const imageService = require('./services/image');
  const imageModel = require('./models/image');
  const fileModel = require('./models/file');
  dbHandler.connect();

  // Create the PPJ Parser early on
  const ppjParser = new Parser();

  // Express only serves static assets in production
  if (client_path != null) {
    app.use(express.static(client_path));
  }

  // FileHandler components
  const fileHandler = require('../FileParse/file-handler');

  var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }

  app.use(bodyParser.json({ limit: '50mb', verify: rawBodySaver }));

  app.get('/api/v2/image', async function (req, res) {
    let filter = await JSON.parse(req.query.filter);
    let sort = await JSON.parse(req.query.sort);
    //console.log('filter', filter);
    //console.log('sort:', sort);
    let selected = await imageModel.find(filter).sort(sort).exec();
    //console.log("Selected",selected);
    //console.log('sort:', sort);
    res.json(selected);
  });

  app.put('/api/v2/image', async function (req, res) {
    const id = req.body._id;
    const field = req.body.field;
    const value = req.body.value;
    let response = null;
    let success = false;
    console.log("adding file");
    try {
      switch (field) {
        case 'selected':
          response = await imageModel.findByIdAndUpdate(id, { selected: value });
          success = true;
          break;
        case 'visible':
          response = await imageModel.findByIdAndUpdate(id, { visible: value });
          success = true;
          break;
        case 'thumbnail_path':
          response = await imageModel.findByIdAndUpdate(id, { thumbnail_path: value });
          success = true;
          break;
        default:
          success = false;
          break;
      }
    }
    catch (e) {
      success = false;
    }
    finally {
      res.json({
        success: success
      });
    }
  });

  app.post('/api/v2/image', async function (req, res) {
    let file_list = req.body.file_obj;
    let file_list_obj = JSON.parse(file_list);
    let fileHandlerObj = new fileHandler(file_list_obj);
    await fileHandlerObj.processList();
    // console.log(JSON.stringify(fileHandlerObj.file_list));
    let results = await imageModel.find({});
    res.json(results);;
  });

  // get selected images from imageModel
  // query filemodel for each selected image
  // return results
  app.get('/api/v2/fileManip', async function (req, res) {
    // query imageModel for selected
    var getSelected = await imageModel.find({ 'selected': true }, { _id: 0, base_path: 1 });
    console.log("MANIP All selected : ", JSON.stringify(getSelected));
    var fileQuery = [];
    //put selected base paths into arry
    for (i = 0; i < getSelected.length; i++) {
      fileQuery.push(getSelected[i].base_path);
    }
    // query filemodel with fileQuery array
    var getFiles = await fileModel.find({ 'base_path': { $in: fileQuery } }, { _id: 0, extension: 1, path: 1, thumb: 1, filename: 1, base_path: 1 });
    res.json(getFiles);
  });

  app.put('/api/v2/remBasePath', async function (req, res) {
    let success = false;
    let toRemove = req.body.remFiles;
    let baseSet = new Set();  //used to filter out same base_paths
    let remBase = []; // used to check for existance in filemodel
    let remPath = []; // used to delete from fileModel
    let remBaseFull = []; // used to delete from imageModel
    try {
      //seperate base_path and path, path into array, base_path into set
      for (i = 0; i < toRemove.length; i++) {
        baseSet.add(toRemove[i].base_path);
        remPath.push(toRemove[i].path);
      }
      remBase = Array.from(baseSet);
      // remove paths from fileModel
      await fileModel.deleteMany({ path: { $in: remPath } });
      // check if base_path in fileModel, if true then do nothing , if false remove from image model
      for (i = 0; i < remBase.length; i++) {
        let check = await fileModel.exists({ base_path: remBase[i] });
        if (check) {
          //partial remove, do nothing
        }
        else {
          // full remove, add to remBaseFull
          remBaseFull.push(remBase[i]);
        }
      }
      // remove images from image model that no longer have a associated file in fileModel
      await imageModel.deleteMany({ base_path: { $in: remBaseFull } });
      success = true;
    }
    catch (e) {
      success = false;
    }
    res.json(success);
  });

  app.get('/api/v2/images/unique', async function (req, res) {
    let all = {};
    let keys = Object.keys(imageModel.schema.paths);
    let i;
    for (i = 0; i < keys.length; i++) {
      all[keys[i]] = await imageModel.distinct(keys[i]).exec();
    }
    res.json(all);
  });

  process.on('SIGTERM', () => dbHandler.closeDatabase())
  process.on('SIGINT', () => dbHandler.closeDatabase())

  s = app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
  });

  return s;
}

module.exports = server;