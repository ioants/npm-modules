'use strict';
/**
 * @file protoio.js
 * @author Adam Saxén
 *
 *  Module for simplifying proto handling
 */

var loaded_proto;
var message_list_proto;
var Promise = require('bluebird');
var Logger  = require('ioant-logger');
var protobuf = Promise.promisifyAll(require("protobufjs"));
var proto_file_path = "./proto/messages.proto";

exports.loadProtoDefinition = function(){
    if (typeof loaded_proto !== 'undefined' && !loaded_proto){
        return new Promise((resolve, reject) => {
            Logger.log('debug', 'Proto definition requested and preloaded');
            resolve(loaded_proto);
        })
    }
    else{
        return protobuf.loadAsync(proto_file_path).then((root) =>{
            Logger.log('debug', 'Proto definition requested and loaded');
            message_list_proto = Object.keys(root.nested);
            message_list_proto.shift();
            loaded_proto = root;
            return new Promise((resolve, reject) => {
                resolve(loaded_proto);
            })
        });
    }
}

exports.setup = function (path_to_proto) {
    proto_file_path = path_to_proto;
 }

exports.underScore = function (str) {
     return str.substring(0,1)
          + str.substring(1)
                .replace(/([A-Z])(?=[a-z]|$)/g, function($0, $1) { return "_" + $1.toLowerCase(); });
 }

exports.swap = function (obj_proto){
  var ret = {};
  for(var key in obj_proto){
    ret[obj_proto[key]] = key;
  }
  return ret;
}

exports.enumerate = function(message_name){
    if (typeof loaded_proto === 'undefined' || !loaded_proto){
        Logger.log('debug', 'Proto definition not loaded for enumerator');
        return -1;
    }
    else {
        return message_list_proto.indexOf(message_name);
    }
}

exports.getProtoMessage = function(message_type) {
    if (typeof loaded_proto === 'undefined' || !loaded_proto){
        Logger.log('debug', 'Proto definition not loaded for getProtoMessage()');
        return exports.loadProtoDefinition().then((proto) => {
            return new Promise(function (resolve, reject){
                resolve(proto.nested[message_list_proto[message_type]]);
            });
        })
    }
    else {
        return new Promise(function (resolve, reject){
            Logger.log('debug', 'Proto definition found for getProtoMessage()');

            resolve(loaded_proto.nested[message_list_proto[message_type]]);
        });
    }
};
