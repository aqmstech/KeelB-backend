const fs = require('fs');
const pluralize = require('pluralize')
const Joi = require('joi');
const newman = require('newman');

const UtilsService = {

  generateModule: async (model_name, ext, generator = null) => {
    const model = await UtilsService.generateValidator(model_name, ext);
    if (!model) {
      console.log('Sorry cannot generate this module')
      return false
    }
    await UtilsService.generateInterface(model, ext);
    await UtilsService.generateService(model, ext);
    await UtilsService.generateModel(model, ext);
    await UtilsService.generateController(model, ext);
    // await UtilsService.generateControllerAdmin(model, ext);
    await UtilsService.generateRoute(model, ext);
    // await UtilsService.generateAdminRoute(model, ext);
    await UtilsService.generatePostmanCollection(model, ext);
    // await UtilsService.generateTestCase(model, ext);
    console.log("-------------" + model + " Module Generated successfully-----------")
  },

  generateModel: async (model_name, ext) => {
    console.log("Creating Model...")
    let dir = `./module/${model_name}`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("------------Folder Created==================");
    }

    let file_name = `${model_name.toLowerCase()}Model.${ext}`;

    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Model already exists with this name");
      return
    }

    let modelName = `${model_name}Model`;
    let importModel = `import { ${modelName} } from './models/${model_name.toLowerCase()}Model' \n//{{importModel}};`
    const modelData = await UtilsService.replaceModelData(model_name);
    fs.writeFileSync(`${dir}/${file_name}`, modelData, function (err, file) {
      if (err) throw err;
      console.log('Model Created Successfully');
    });
    const appFileData = UtilsService.replaceAppFileData({modelName, importModel})
    fs.writeFileSync(`./app.ts`, appFileData, function (err, file) {
      if (err) throw err;
    });
    return true
    // process.exit(0)

  },

  generateInterface: async (model_name, ext) => {
    console.log("Creating Interface...")
    let dir = `./module/${model_name}`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("------------Folder Created==================");
    }
    let file_name = `${model_name.toLowerCase()}Interface.${ext}`;

    if (!fs.existsSync(`${dir}/${file_name}`)) {
      try {
        const interfaceData = await UtilsService.replaceInterfaceData(model_name);
        
        fs.writeFileSync(`${dir}/${file_name}`, interfaceData, function (err, file) {
          if (err) throw err;
          console.log('Interface Created Successfully');
        });
      } catch (error) {
        console.log('err-->', error);
      }
    }
  },

  generateRoute: async (model_name, ext) => {
    console.log("Creating Route...")
    let dir = `./module/${model_name}`
    let model_name_arr = model_name.split('/');
    let model_name_last = model_name_arr[model_name_arr.length - 1];
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("------------Folder Created==================");
    }

    let file_name = `${model_name_last.toLowerCase()}Routes.${ext}`;

    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Route already exists with this name");
      return
    }

    if (model_name_arr.length > 1) {
      for (let i = 0; i < model_name_arr.length - 1; i++) {
        if (!fs.existsSync(model_name_arr[i])) {
          fs.mkdirSync(model_name_arr[i]);
        }
      }
    }

    let file_name_without_ext = `${model_name_last.toLowerCase()}`;

    let routerName = model_name_last + "Router";
    let route_name = `this.server.app.use("/api/v1/${pluralize(model_name_last.toLowerCase())}", ${routerName}.router)`
    const controllerData = await UtilsService.replaceRouteData(model_name, ext);
    const indexFileData = await UtilsService.replaceIndexFileData({route_name, routerName, file_name_without_ext, dir})
    fs.writeFileSync(`${dir}/${file_name}`, controllerData, function (err, file) {
      if (err) throw err;
      console.log('Route Created Successfully');
    });

    fs.writeFileSync(`./server/http.ts`, indexFileData, function (err, file) {
      if (err) throw err;
    });

    return true
  },

  generateAdminRoute: async (model_name, ext) => {
    console.log("Creating Admin Route...")
    let dir = './routes/admin/v1'
    let model_name_arr = model_name.split('/');
    let model_name_last = model_name_arr[model_name_arr.length - 1];

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let file_name = `${model_name_last.toLowerCase()}AdminRoutes.${ext}`;

    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Route already exists with this name");
      return
    }

    if (model_name_arr.length > 1) {
      for (let i = 0; i < model_name_arr.length - 1; i++) {
        if (!fs.existsSync(model_name_arr[i])) {
          fs.mkdirSync(model_name_arr[i]);
        }
      }
    }

    let file_name_without_ext = `${model_name_last.toLowerCase()}Admin`;

    let routerName = model_name_last + "AdminRouter";
    let route_name = `this.server.app.use("/admin/v1/${pluralize(model_name_last.toLowerCase())}", ${routerName}.router)`
    const controllerData = await UtilsService.replaceAdminRouteData(model_name, ext);
    const indexFileData = await UtilsService.replaceIndexFileData({route_name, routerName, file_name_without_ext, dir})
    fs.writeFileSync(`${dir}/${file_name}`, controllerData, function (err, file) {
      if (err) throw err;
      console.log('Admin Route Created Successfully');
    });

    fs.writeFileSync(`./server/http.ts`, indexFileData, function (err, file) {
      if (err) throw err;
    });

    return true
  },

  generatePostmanCollection: async (model_name, ext) => {
    // Load your collection structure from the JSON file
    const collectionStructure = require(`./schema/${model_name.toLowerCase()}.json`);

    // Define the directory for Postman collections
    const collectionDir = 'bin/postman-collection';

    // Define the path to the existing Postman collection file
    const collectionFile = `${collectionDir}/boilerplateCollection.postman_collection`;

    if (!fs.existsSync(collectionFile)) {
      console.error('The Postman collection file does not exist.');
      return;
    }

    // Read the existing Postman collection
    const existingCollectionData = fs.readFileSync(collectionFile, 'utf8');
    const existingCollection = JSON.parse(existingCollectionData);

    // Create a new request and add it to the existing collection
    const newRequest = await UtilsService.generateCollectionData(collectionStructure)

    // Add the new request to the existing collection
    existingCollection.item.push(newRequest);

    // Save the updated Postman collection back to the file
    fs.writeFileSync(collectionFile, JSON.stringify(existingCollection, null, 2), 'utf8');

    console.log(`Request added to the Postman collection: ${collectionFile}`);
  },
  generateCollectionData: async (data) => {
    return {
      "name": data.model,
      "item": [
        {
          name: `Add ${data.model}`,
          event: [],
          request: {
            method: 'POST',
            header: [
              {
                key: 'Authorization',
                value: 'Bearer {{token}}',
                type: 'text',
              },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(await UtilsService.generateSampleData(data.columns, 'POST')),
              options: {
                raw: {
                  language: 'json',
                },
              },
            },
            description: `Add a new ${data.model}`,
            url: {
              raw: `{{baseUrl}}${pluralize(data.model.toLowerCase())}`,
              host: [`{{baseUrl}}${pluralize(data.model.toLowerCase())}`],
            },
            response: [],
          },
        },
        {
          "name": `Delete ${data.model}`,
          "event": [],
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": `{{baseUrl}}${pluralize(data.model.toLowerCase())}/1`,
              "host": [
                `{{baseUrl}}${pluralize(data.model.toLowerCase())}`
              ],
              "path": [
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": `Get Single ${data.model}`,
          "event": [],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": `{{baseUrl}}${pluralize(data.model.toLowerCase())}/1`,
              "host": [
                `{{baseUrl}}${pluralize(data.model.toLowerCase())}`
              ],
              "path": [
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": `Get All ${data.model}`,
          "event": [],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": `{{baseUrl}}${pluralize(data.model.toLowerCase())}`,
              "host": [
                `{{baseUrl}}${pluralize(data.model.toLowerCase())}`
              ],
              "query": [
                {
                  "key": "withoutPagination",
                  "value": "1",
                  "description": "with out pagination"
                },
                {
                  "key": "page",
                  "value": "1",
                  "description": "page number"
                },
                {
                  "key": "per_page",
                  "value": "1",
                  "description": "rows limit"
                },
                {
                  "key": "keyword",
                  "value": "1",
                  "description": "keyword search",
                  "disabled": true
                },
                {
                  "key": "filter",
                  "value": JSON.stringify(await UtilsService.generateSampleData(data.columns, 'GET')),
                  "description": "search filters",
                  "disabled": true
                },
              ]
            }
          },
          "response": []
        },
        {
          "name": `Update ${data.model}`,
          "event": [],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}",
                "type": "text"
              }
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(await UtilsService.generateSampleData(data.columns, 'PUT')),
              options: {
                raw: {
                  language: 'json',
                },
              },
            },
            "url": {
              "raw": `{{baseUrl}}${pluralize(data.model.toLowerCase())}/1`,
              "host": [
                `{{baseUrl}}${pluralize(data.model.toLowerCase())}`
              ],
              "path": [
                "1"
              ]
            }
          },
          "response": []
        },
      ]
    }
  },
  generateController: async (model_name, ext) => {
    console.log("Creating Controller...")
    let dir = `./module/${model_name}`
    let model_name_arr = model_name.split('/');
    let model_name_last = model_name_arr[model_name_arr.length - 1];

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("------------Folder Created==================");
    }

    let file_name = `${model_name_last.toLowerCase()}Controller.${ext}`;

    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Controller already exists with this name");
      return
    }

    if (model_name_arr.length > 1) {
      for (let i = 0; i < model_name_arr.length - 1; i++) {
        if (!fs.existsSync(model_name_arr[i])) {
          fs.mkdirSync(model_name_arr[i]);
        }
      }
    }

    let file_name_without_ext = `${model_name_last.toLowerCase()}`;

    let routerName = model_name_last + "Router";
    let route_name = `this.server.app.use("/api/v1/${pluralize(model_name_last.toLowerCase())}", ${routerName}.router)`
    const controllerData = await UtilsService.replaceControllerData(model_name, ext);
    const indexFileData = await UtilsService.replaceIndexFileData({route_name, routerName, file_name_without_ext, dir})

    fs.writeFileSync(`${dir}/${file_name}`, controllerData, function (err, file) {
      if (err) throw err;
      console.log('Controller Created Successfully');
    });

    /*fs.writeFileSync(`./server/http.ts`, indexFileData, function (err, file) {
      if (err) throw err;
    });*/
    return true

  },

  generateControllerAdmin: async (model_name, ext) => {
    console.log("Creating Admin Controller...")
    let dir = './controllers/admin'
    let model_name_arr = model_name.split('/');
    let model_name_last = model_name_arr[model_name_arr.length - 1];

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let file_name = `admin${UtilsService.capitalizeFirstLetter(model_name_last)}Controller.${ext}`;

    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Controller already exists with this name");
      return
    }

    if (model_name_arr.length > 1) {
      for (let i = 0; i < model_name_arr.length - 1; i++) {
        if (!fs.existsSync(model_name_arr[i])) {
          fs.mkdirSync(model_name_arr[i]);
        }
      }
    }

    const controllerData = await UtilsService.replaceAdminControllerData(model_name, ext);
    fs.writeFileSync(`${dir}/${file_name}`, controllerData, function (err, file) {
      if (err) throw err;
      console.log('Controller Created Successfully');
    });
    return true
  },

  generateService: async (model_name, ext) => {
    console.log('Creating Service...')
    let dir = `./module/${model_name}`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("------------Folder Created==================");
    }

    let file_name = `${model_name.toLowerCase()}Service.${ext}`;

    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Service already exists with this name");
      return
    }

    const service_data = await UtilsService.replaceServiceData(model_name, ext);

    fs.writeFileSync(`${dir}/${file_name}`, service_data, function (err, file) {
      if (err) throw err;
      console.log('Service Created Successfully');
    });
    
    return true
  },
  
  isSchemaExist: async (filename) => {
    const filePath = __dirname + `/schema/${filename}.json`
    try {
      fs.accessSync(filePath, fs.constants.F_OK)
      return true
    } catch (error) {
      return false
    }
  },
  
  generateValidator: async (model_name, ext) => {
    const schemaFileExist = await UtilsService.isSchemaExist(model_name)
    if (!schemaFileExist) {
      console.log("Schema file is required.")
      return
    }
    console.log("Creating Validator and schema...")
    const capitalized_model_name = UtilsService.capitalizeFirstLetter(model_name)
    let dir = `./module/${capitalized_model_name}`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("------------Folder Created==================");
    }

    const validator_data = await UtilsService.replaceValidatorData(model_name, ext);
    const model = UtilsService.capitalizeFirstLetter(validator_data.model)
    let file_name = `${model_name}Validator.${ext}`;
    
    if (fs.existsSync(`${dir}/${file_name}`)) {
      console.log("Validator already exists with this name");
      return
    }


    fs.writeFileSync(`${dir}/${file_name}`, validator_data.validator_data, function (err, file) {
      if (err) throw err;
    });
    return UtilsService.capitalizeFirstLetter(validator_data.model)
  },

  generateTestCase: async (model_name, ext_name) => {
    try {

      console.log("IN TESTSTS")

      let dir = './test'
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      let file_name = `test.ts`;


      const testCaseData = await UtilsService.replacetestCaseData(model_name, ext_name);
      console.log('testCaseData-->', testCaseData)
      fs.writeFileSync(`./test/${file_name}`, testCaseData, function (err, file) {
        if (err) throw err;
        console.log('Test Case Created Successfully');
      });

    } catch (error) {
      console.log('generateTestCase-->', generateTestCase);
    }

  },

  getSchema: async (model_name) => {
    // const SchemaData = mongoose.model(model_name, new Schema({}));
    // let schema =  await SchemaData.findOne({},{_id:0,updatedAt:0,createdAt:0,deletedAt:0})
    // console.log('schema-->',schema);
    // console.log('model_name-->',model_name);
    // return schema && schema._doc?Object.keys(schema._doc):[];
  },

  convertSchema: async (model_name) => {
    let keys = await UtilsService.getSchema(model_name);
    let schema = {};
    if (keys.length) {
      keys.forEach(key => {
        schema[key] = {required: true, type: typeof key};
      })
    }

    console.log('schema-->', schema);
    return schema;
  },

  showHelp: () => {
    console.log('\nOptions:\r')
    console.log('\t--version\t ' + 'Show version number.' + '\t\t' + '[boolean]\r')
    console.log('\tadd\t\t ' + 'module_name' + '\tCreate a Module\t\t' + '[boolean]\n')
    console.log('\tremove\t\t ' + 'module_name' + '\tRemove a Module\t\t' + '[boolean]\n')
    process.exit(0)
  },

  getOptions: () => {

    return ['model', 'controller']

  },

  replaceControllerData: async (model_name, ext) => {
    const controller_data = fs.readFileSync('./bin/controller.txt', 'utf8');
    let data = controller_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    data = data.replace(new RegExp("{{module_name_lower}}", "g"), model_name.toLowerCase());
    data = data.replace("{{ext_name}}", ext);
    return data;
  },

  replaceAdminControllerData: (model_name, ext) => {
    const controller_data = fs.readFileSync('./bin/controllerAdmin.txt', 'utf8');
    let data = controller_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    data = data.replace(new RegExp("{{module_name_lower}}", "g"), model_name.toLowerCase());
    data = data.replace("{{ext_name}}", ext);
    return data;
  },

  replaceRouteData: async (model_name, ext) => {
    const controller_data = fs.readFileSync('./bin/route.txt', 'utf8');
    let data = controller_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    data = data.replace(new RegExp("{{module_name_lower}}", "g"), model_name.toLowerCase());
    data = data.replace("{{ext_name}}", ext);
    return data;
  },

  replaceAdminRouteData: async (model_name, ext) => {
    const controller_data = fs.readFileSync('./bin/adminRoute.txt', 'utf8');
    let data = controller_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    data = data.replace(new RegExp("{{module_name_lower}}", "g"), model_name.toLowerCase());
    data = data.replace("{{ext_name}}", ext);
    return data;
  },

  replaceServiceData: async (model_name, ext) => {
    const service_data = fs.readFileSync('./bin/service.txt', 'utf8');
    let data = service_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    data = data.replace(new RegExp("{{module_name_lower}}", "g"), model_name.toLowerCase());
    data = data.replace("{{ext_name}}", ext);
    return data;
  },

  replaceValidatorData: async (module_name, ext) => {
    const validator_data = fs.readFileSync('./bin/joiValidator.txt', 'utf8');
    let data = validator_data.replace(new RegExp("{{module_name}}", "g"), UtilsService.capitalizeFirstLetter(module_name));
    data = data.replace(new RegExp("{{module_name}}", "g"), UtilsService.capitalizeFirstLetter(pluralize(module_name)));
    const schema = await UtilsService.generateSchema(module_name)
    if (schema.schema.add) {
      data = data.replace(new RegExp("{{addColumnSchema}}", "g"), JSON.stringify(schema.schema.add, '', 2).replace(/"/g, ''));
    }
    if (schema.schema.update) {
      data = data.replace(new RegExp("{{updateColumnSchema}}", "g"), JSON.stringify(schema.schema.update, '', 2).replace(/"/g, ''));
    }
    if (schema.schema.get) {
      data = data.replace(new RegExp("{{getColumnSchema}}", "g"), JSON.stringify(schema.schema.get, '', 2).replace(/"/g, ''));
    }

    return {validator_data: data, model: schema.model};
  },

  replaceModelData: async (model_name) => {
    const model_data = fs.readFileSync('./bin/model.txt', 'utf8');
    let data = model_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    // let keys = await UtilsService.convertSchema(model_name);
    data = data.replace(new RegExp("{{module_name_lower}}", "g"), pluralize(model_name.toLowerCase()));
    data = data.replace(new RegExp("{{module_name_lower_singular}}", "g"), model_name.toLowerCase());
    const fillables = await UtilsService.getModelColumns(model_name)
    data = data.replace(new RegExp("{{columnsFillables}}", "g"), JSON.stringify(fillables, '', 2));
    return data;
  },

  getModelColumns: async (model_name) => {
    const jsonData = require(`./schema/${model_name.toLowerCase()}.json`); // Replace with the path to your JSON config file
    return jsonData.columns.map(item => ({
      column: item.name,
      type: item.dataType
    }));
  },
  replaceInterfaceData: async (model_name) => {
    const model_data = fs.readFileSync('./bin/interface.txt', 'utf8');
    let data = model_data.replace(new RegExp("{{module_name}}", "g"), model_name);
    let columnSchema = await UtilsService.generateInterfaceSchema(model_name)
    console.log()
    data = data.replace(new RegExp("{{schema}}", "g"), JSON.stringify(columnSchema, '', 2).replace(/"/g, ''));
    // let keys = await UtilsService.convertSchema(model_name);
    return data;
  },

  replacetestCaseData: async (model_name, ext_name) => {
    try {
      const testData = fs.readFileSync('./test/test.ts', 'utf8');
      let importStatement = `import {${model_name}Model} from '../../models/${model_name.toLowerCase()}Model.${ext_name}' \n//{{importModel}}`
      let testDataToReplace = testData.replace("//{{importModel}}", importStatement);
      let casesToReplace = await UtilsService.replaceCases(model_name, ext_name);
      testDataToReplace = testDataToReplace.replace("//{{testCases}}", casesToReplace);
      return testDataToReplace;
    } catch (error) {
      console.log('error-->', error);
    }

  },

  replaceCases: async (model_name, ext_name) => {
    try {
      const test_case_data = fs.readFileSync('./bin/test.txt', 'utf8');
      let data = test_case_data.replace("{{module_name_lower}}", pluralize(model_name.toLowerCase()));
      data = data.replace("{{module_name}}", model_name)
      data += " \n //{{testCases}}"
      return data;
    } catch (error) {
      console.log('error-->', error);
    }

  },

  replaceIndexFileData: async (params) => {
    try {
      const indexData = fs.readFileSync('./server/http.ts', 'utf8');
      const importStatement = `import * as ${params.routerName} from '.${params.dir}/${params.file_name_without_ext}`;
      const routerStatement = `${params.route_name} \n//{{router}}`
      let data = !indexData.includes(routerStatement) ? indexData.replace("//{{registerRouter}}", `${params.route_name} \n//{{registerRouter}}`) : indexData;
      data = !indexData.includes(importStatement) ? data.replace("//{{importRoutes}}", `import * as ${params.routerName} from '.${params.dir}/${params.file_name_without_ext}Routes' \n//{{importRoutes}}`) : data;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  replaceAppFileData: (params) => {
    try {
      const indexData = fs.readFileSync('./app.ts', 'utf8');
      const importStatement = params.importModel
      const initStatement = `await ${params.modelName}.INIT() \n//{{modelInit}}`
      let data = !indexData.includes(initStatement) ? indexData.replace("//{{modelInit}}", initStatement) : indexData;
      data = !indexData.includes(importStatement) ? data.replace("//{{importModel}}", importStatement) : data;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  capitalizeFirstLetter: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  removeModule: async (model_name, ext) => {
    // Capitalize to remove folder
    let model = await UtilsService.capitalizeFirstLetter(model_name);
    console.log(`./module/${model}/${model_name}Validator.${ext}`);
    UtilsService.removeFileIfExists(`./module/${model}/${model_name.toLowerCase()}Model.${ext}`);
    UtilsService.removeFileIfExists(`./module/${model}/${model_name.toLowerCase()}Interface.${ext}`);
    UtilsService.removeFileIfExists(`./module/${model}/${model_name.toLowerCase()}Controller.${ext}`);
    // UtilsService.removeFileIfExists(`./controllers/admin/admin${UtilsService.capitalizeFirstLetter(model_name)}Controller.${ext}`);
    UtilsService.removeFileIfExists(`./module/${model}/${model_name.toLowerCase()}Service.${ext}`);
    UtilsService.removeFileIfExists(`./module/${model}/${model_name}Validator.${ext}`);
    UtilsService.removeFileIfExists(`./module/${model}/${model_name.toLowerCase()}Routes.${ext}`);
    // UtilsService.removeFileIfExists(`./routes/admin/v1/${model_name.toLowerCase()}AdminRoutes.${ext}`);
    // UtilsService.removeFileIfExists(`bin/postman-collection/${model_name}.json`);
    // ... Remove other related files ...
    
    // Update references or clean up app.ts, http.ts, and other relevant files
    UtilsService.removeFolderIfExists(`./module/${model}`);
    UtilsService.removeFromAppFile(model);
    UtilsService.removeFromHttpFile(model);

    console.log("-------------Module Removed successfully-----------");
  },
  removeFileIfExists: (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`${filePath} removed.`);
    }
  },
  removeFolderIfExists: (folderPath) => {
    if (fs.rmdirSync(folderPath)) {
      fs.unlinkSync(folderPath);
      console.log(`${folderPath} removed.`);
    }
  },
  removeFromAppFile: (model_name) => {
    const appFilePath = './app.ts';
    if (fs.existsSync(appFilePath)) {
      let appFileContent = fs.readFileSync(appFilePath, 'utf8');

      // Remove the line containing import statement for the removed model
      const importStatement = `import { ${model_name}Model } from './models/${model_name.toLowerCase()}Model'`;
      appFileContent = appFileContent.replace(importStatement, '');

      // Write the updated content back to the app.ts file
      fs.writeFileSync(appFilePath, appFileContent, 'utf8');
      console.log(`Removed import statement for ${model_name}Model from app.ts`);
    }
  },
  removeFromHttpFile: (model_name) => {
    const httpFilePath = './server/http.ts';
    console.log(`../module/${model_name.toLowerCase()}`);
    const dirApi = `../module/${model_name.toLowerCase()}`;
    // const dirAdmin = './routes/admin/v1';

    if (fs.existsSync(httpFilePath)) {
      let httpFileContent = fs.readFileSync(httpFilePath, 'utf8');

      // Remove the lines related to the removed module
      const file_name_without_ext = `${model_name.toLowerCase()}`;
      const routerName = model_name + "Router";
      const routerNameAdmin = model_name + "AdminRouter";

      const route_name = `this.server.app.use("/api/v1/${pluralize(model_name.toLowerCase())}", ${routerName}.router)`;
      // const route_name_admin = `this.server.app.use("/admin/v1/${pluralize(model_name.toLowerCase())}", ${routerNameAdmin}.router)`;

      const import_statementApi = `import * as ${routerName} from '${dirApi}/${file_name_without_ext}Routes'`;
      // const import_statementAdmin = `import * as ${routerNameAdmin} from '.${dirAdmin}/${file_name_without_ext}AdminRoutes'`;

      console.log(route_name,import_statementApi);
      httpFileContent = httpFileContent.replace(route_name, '');
      // httpFileContent = httpFileContent.replace(route_name_admin, '');
      httpFileContent = httpFileContent.replace(import_statementApi, '');
      // httpFileContent = httpFileContent.replace(import_statementAdmin, '');
      fs.writeFileSync(httpFilePath, httpFileContent, 'utf8');
      console.log(`Removed code related to ${model_name} from http.ts`);
    }
  },

  generateSchema: async (model_name) => {
    const jsonData = require(`./schema/${model_name}.json`); // Replace with the path to your JSON config file
    let modelName = jsonData.model
    const schema = await UtilsService.generateJoiSchema(modelName, jsonData);
    return {schema: schema, model: modelName}
  },
  generateJoiSchema: async (model, data) => {
    const schemaColumn = {add: {}, update: {}, get: {}};
    data.columns.forEach(column => {

      let schema = '';
      switch (column.dataType) {
        case 'string':
        case 'text':
          schema = `Joi.string()`;
          break;
        case 'number':
          schema = `Joi.number()`;
          break;
        case 'date':
          schema = `Joi.date()`;
          break;
        case 'boolean':
          schema = `Joi.boolean()`;
          break;
        case 'array':
          schema = `Joi.array()`;
          break;
        case 'enum':
          schema = `Joi.string()`;
          break;
        case 'email':
          schema = `Joi.string()`;
          break;
        default:
          schema = `Joi.any()`;
          break;
      }

      if (column.dataType) {
        if (column.equalTo) {
          schema += `.valid(Joi.ref('${column.equalTo}'))`;
        }
        if (column.minLength) {
          schema += `.min(${column.minLength})`;
        }
        if (column.maxLength) {
          schema += `.max(${column.maxLength})`;
        }
        if (column.maxDate) {
          schema += `.max('${column.maxDate}').iso()`;
        }
        if (column.only && column.only.length) {
          schema += `.valid(${column.only.map(item => `'${item}'`).join(',')})`;
        }
        if (column.options && column.options.length) {
          schema += `.valid(${column.options.map(item => `'${item}'`).join(',')})`;
        }
        if (column.greaterThan) {
          schema += `.greater(${column.greaterThan})`;
        }
        if (column.minValue) {
          schema += `.greater(${column.minValue})`;
        }
        if (column.regex) {
          schema += `.regex('${column.regex}')`;
        }
        if (column.positive) {
          schema += `.positive()`;
        }
      }
      if (column.list === undefined || !column.list === false) {
        schemaColumn.get[column.name] = schema
      }
      if (column.required) {
        schema += `.required()`;
      }
      if (column.add === undefined || !column.add === false) {
        schemaColumn.add[column.name] = schema
      }
      if (column.update === undefined || !column.update === false) {
        schemaColumn.update[column.name] = schema
      }
    });
    schemaColumn.get['keyword'] = `Joi.any()`
    schemaColumn.get['withoutPagination'] = `Joi.any()`
    schemaColumn.get['page'] = `Joi.any()`
    schemaColumn.get['per_page'] = `Joi.any()`
    return schemaColumn
  },
  generateInterfaceSchema: async (model_name) => {
    const jsonData = require(`./schema/${model_name.toLowerCase()}.json`); // Replace with the path to your JSON config file
    const schemaColumn = {};
    jsonData.columns.forEach(column => {
      let schema;
      switch (column.dataType) {
        case 'string':
          schema = `string`;
          break;
        case 'number':
          schema = `number`;
          break;
        case 'date':
          schema = `string`;
          break;
        case 'boolean':
          schema = `boolean`;
          break;
        case 'array':
          schema = `[]`;
          break;
        case 'enum':
          schema = `string`;
          break;
        case 'email':
          schema = `string`;
          break;
        default:
          schema = `any`;
          break;
      }
      if (!column.required || column.required == undefined) {
        column.name += '?';
      }

      schemaColumn[column.name] = schema
    });
    return schemaColumn
  },
  mapDatatypes: (dataType) => {
    let joiType;
    switch (dataType) {
      case 'string':
      case 'text':
        joiType = Joi.string();
        break;
      case 'number':
        joiType = Joi.number();
        break;
      case 'date':
        joiType = Joi.date();
        break;
      case 'boolean':
        joiType = Joi.boolean();
        break;
      case 'array':
        joiType = Joi.array();
        break;
      default:
        // Handle unknown data types or return a default Joi type
        joiType = Joi.any();
    }
    return joiType
  },
  determineJoiType: async (dataType) => {
    const typeMap = {
      string: 'string',
      text: 'string',
      number: 'number',
      date: 'date',
      boolean: 'boolean',
      array: 'array',
    };
    return typeMap[dataType];
  },
  // Function to generate sample data based on the columns
  generateSampleData: async (columns, type) => {
    const sampleData = {};
    for (const column of columns) {
      if (type == 'POST' && (column.add === undefined || column.add == true)) {
        sampleData[column.name] = await UtilsService.getSampleValue(column);
      }
      if (type == 'PUT' && (column.update === undefined || column.update == true)) {
        sampleData[column.name] = await UtilsService.getSampleValue(column);
      }
      if (type == 'GET' && (column.list === undefined || column.list == true)) {
        sampleData[column.name] = await UtilsService.getSampleValue(column);
      }
    }
    return sampleData;
  },
  getRandomString: (length = 10) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  },
  getRandomNumber: (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  // Function to get sample value based on data type
  getSampleValue: async (column) => {
    switch (column.dataType) {
      case 'string':
      case 'text':
        return UtilsService.getRandomString(column.minLength + 2)
      case 'number':
        UtilsService.getRandomNumber(column.minValue, column.max)
      case 'date':
        return '0000-00-00';
      case 'boolean':
        return true
      case 'array':
        return []
      case 'enum':
        return column.options[0] || ''
      case 'email':
        return `${UtilsService.getRandomString(10)}@yopmail.com`
      default:
        return null
    }
  },
  toCamelCase: (string) => {
    return string
        .toLowerCase()
        .replace(/[-_](.)/g, (_, group1) => group1.toUpperCase());
  },

  capitalizeFirstLetter: (input) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  },

}

module.exports = UtilsService;