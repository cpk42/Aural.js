const fs = require('fs');
const configure = require("./config.js")
const readline = require('readline');

class Aural {
  constructor(name, fileName, schema) {
      this.config = Object.assign(configure)
      this.config.name = name
      this.config.file = fileName
      this.config.schema = Object.assign(schema)
  }

  writeToFile(str) {
    fs.writeFileSync(this.config.file, str, (err) => {
      if (err)
          throw error
    })
  }

  removeEntry(index) {
    var file = fs.readFileSync(this.config.file, this.config.encoding)
    if (file) {
      var entries = JSON.parse(file)
      if (entries.numEntries > 0){
        entries.entries.splice(index, 1)
        entries.numEntries -= 1
        this.writeToFile(JSON.stringify(entries))
        console.log('Removed entry from ' + this.config.name + '!')
      }
      else {
        console.log('No data to remove!')
      }
    }
  }

  init() {
    if (fs.existsSync(this.config.file)) {
      if (!fs.readFileSync(this.config.file, this.config.encoding)){
        console.log("File exists but is empty, Initializing config file.")
        this.config.configPresent = true
        this.writeToFile(JSON.stringify(this.config))
      }
      else
        console.log("Database " + this.config.name + " already exists...")
    }
    else {
      var entry = this.config
      entry.configPresent = true
      fs.closeSync(fs.openSync(this.config.file, 'w'));
      this.writeToFile(JSON.stringify(entry))
    }
  }

  addEntry(entry) {
    var file = fs.readFileSync(this.config.file, this.config.encoding)
    if (file) {
      var entries = JSON.parse(file)
      if (entries.configPresent) {
          console.log('Added entry to ' + this.config.name + '!')
          entries.numEntries += 1
          entries.entries.push(entry)
          this.writeToFile(JSON.stringify(entries))
      }
      else {
        console.log("Database lacks config file!\nPlease run .init() to initialize database config!")
      }
    }
    else
      console.log("Database lacks config file!\nPlease run .init() to initialize database config!")
  }

  getEntry(i){
    var file = fs.readFileSync(this.config.file, this.config.encoding)

    if (file) {
      var entries = JSON.parse(file)
      if (entries.configPresent) {
        if (entries.numEntries >= 1){
          console.log('Receiving entry ' + i)
          console.log(entries.entries[i])
        }
        else {
          console.log('No Entries')
        }
      }
    }
    else {
      console.log()
    }
  }

  run(config) {
    var temp = this
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    console.log('Initializing empty database...')
    this.init()
    console.log("Press\n'a' to add an entry\n'r' to remove an entry\n'q' or 'exit' to quit")
    rl.on('line', function(line){
      if (line == 'a')
        temp.addEntry(config)
      else if (line == 'r')
        temp.popEntry(config)
      else if (line == 'exit' || line == 'quit' || line == 'q')
        process.exit(1)
    })
  }

  clear() {
    var file = fs.readFileSync(this.config.file, this.config.encoding)
    this.writeToFile("")
  }

  numEntries() {
    var file = fs.readFileSync(this.config.file, this.config.encoding)

    if (file){
      var entry = JSON.parse(file)
      if (!entry.numEntries)
        console.log('No Entries!')
      else
        console.log('There are ' + entry.numEntries + ' entries!')
    }
  }

  listEntries() {
    var file = fs.readFileSync(this.config.file, this.config.encoding)
    var entry = JSON.parse(file)
    if (file){
      if (!entry.numEntries)
        console.log('No Entries!')
      else
        console.log(entry.entries)
    }
  }

  help() {
      console.log('Create a new class with:\nvar db = new Aural("name", "fileName.json", schema)\nNote that schema is an object template used as the schematic for the entirety of the Database\n\ndb.init():\nInitialize an empty database\n\ndb.addEntry(entry):\nAdd a JSON object as an entry\n\ndb.getEntry(0):\nGet an Entry at its given index\n\ndb.numEntries():\nGet number of entries\n\ndb.listEntries():\nList all entries\n\ndb.removeEntry(0):\nRemove an entry at its given index\n\ndb.clear():\nClear the JSON file\n')
  }
}

module.exports = Aural;
// function main(){
//   var schema = {
//     "phrase": "",
//     "response": "",
//     "voice": ""
//   }
//   var db = new Aural(configure, "newAural", "db.json", schema)
//
//   // db.init()
//   // db.run()
//   // db.addEntry()
//   // db.getEntry(0)
//   // db.numEntries()
//   // db.listEntries()
//   // db.removeEntry(0)
//   // db.clear()
// }
// main();
