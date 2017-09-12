var StudentsDAO = require('../students/dao').StudentsDAO;
var EntityEnreacher = require('../../entityEnreacher').EntityEnreacher;
var ObjectID = require('mongodb').ObjectID;

function GroupsDAO(db) {
    "use strict";

    var entityEnreacher = new EntityEnreacher();

    /* If this constructor is called without the "new" operator, "this" points
    * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof GroupsDAO)) {
        console.log('Warning: GroupsDAO constructor called without "new" operator');
        return new GroupsDAO(db);
    }

    var students = new StudentsDAO(db);
    var groups = db.collection("groups");

    this.insertEntry = function (entry, callback) {
        "use strict";

        entityEnreacher.enreach(entry);

        // need to manually convert string to ISODate
        entry.startTime = new Date(entry.startTime);
        entry.endTime = new Date(entry.endTime);

        console.log("inserting groups entry" + JSON.stringify(entry));

        groups.insert(entry,function(err,insertedInfo){
          "use strict";
          console.log('inserted.. ' + JSON.stringify(insertedInfo));
          if(err)return callback(err,null);
          /**
          mongo API returns insertedInfo with this syntax:
          {"result":{"ok":1,"n":1},"ops":[{"name":"NodeJs from Scratch","refreshTime":"3600000","startTime":"2014-10-29T12:30:41.647Z","endTime":"2014-12-31T12:30:41.647Z","criteria":{"level":"beginners","language":"JavaScript"},"_createdAt":"2017-09-12T12:06:26.218Z","_updatedAt":"2017-09-12T12:06:26.218Z","_v":1,"_id":"59b7cdc265330c51706ab7e6"}],"insertedCount":1,"insertedIds":["59b7cdc265330c51706ab7e6"]}
          */
          callback(err, insertedInfo.ops[0]);
      });
    }

    this.updateEntry = function (entry, callback) {
        "use strict";

        entityEnreacher.enreach(entry);

        console.log("updating groups entry" + JSON.stringify(entry));

        if(entry._id){
            var toUpdate = JSON.parse(JSON.stringify(entry));;
            var obj_id = ObjectID.createFromHexString(entry._id);
            delete entry._id; // remove _id from the object to make save work (_id is readonly)
            groups.update(
                {_id: obj_id},
                entry,
                function(err, cnt, status){
                    "use strict";
                    console.log('updated.. ' + JSON.stringify(toUpdate));
                    if(err)return callback(err,null);
                    if(cnt=0) throw new Error("Could not update object");

                    callback(err, toUpdate);
                }
                );
        }else{
            var error = new Error('Bad request'); 
            error.code = '400';
            throw error;
        }
    }

    this.getEntry = function(groupId, callback) {
        "use strict";
        var obj_id = ObjectID.createFromHexString(groupId);

        groups.findOne({_id: obj_id},function(err, document) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + JSON.stringify(document));

            callback(err, document);
        });
    };

    this.getAll = function(criteria, skip, limit, callback) {
        "use strict";

        groups.find().sort('_createdAt', -1).skip(skip).limit(limit).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " groups");

            callback(err, items);
        });
    };

    this.getMatching = function(userId, skip, limit, callback) {
        "use strict";

        // search user by ID
        students.getEntry(userId,function(err, user){

               var crit = [];
               var keys = Object.keys(user.attributes)
               for (var i = 0; i < keys.length; i++) { 
                // for each( var k in keys ) {
                    var o1 = {}; var o2 = {};
                    var k = keys[i];
                    o1["criteria." + k] = user.attributes[k]; 
                    o2["criteria." + k] = { $exists: false };
                    crit.push( {$or: [o1,o2]});
                }

                var now = new Date();
                // crit.push({ startTime: { $lte: now }});
                // crit.push({ endTime: { $gte: now }});

                var criteria = {
                 $and :    crit

             };

             console.log('criteria: ' + JSON.stringify(criteria));

             groups.find(criteria).sort('startTime', -1).skip(skip).limit(limit).toArray(function(err, items) {
                "use strict";
                if (err) return callback(err, null);
                
                console.log("Found " + items.length + " active groups(s)");
                callback(err, items);
            });

         });
};

this.getMatchingStudents = function(groupId, limit, callback) {
    "use strict";
        
        // search group by ID
        this.getEntry(groupId,function(err, group){

            var crit = [];
            var keys = Object.keys(group.criteria)
            for (var i = 0; i < keys.length; i++) { 
                // for each( var k in keys ) {
                    var o1 = {}; var o2 = {};
                    var k = keys[i];
                    o1["attributes." + k] = group.criteria[k]; 
                    o2["attributes." + k] = { $exists: false };
                    crit.push( {$or: [o1,o2]});
                }

                var criteria = {
                 $and :    crit
             };

             console.log('criteria: ' + JSON.stringify(criteria));
             students.getAll(criteria, 0,0, function(err, items) {

                if (err) return callback(err, null);
                
                console.log("Found " + items.length + " students(s)");
                callback(err, items);
            });

         });
    };
}

module.exports.GroupsDAO = GroupsDAO;