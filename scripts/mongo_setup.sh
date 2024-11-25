#!/bin/bash
sleep 10

mongosh --host comp1842-mongo-1:27017 <<EOF
  var cfg = {
    "_id": "comp1842-replica-set",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "comp1842-mongo-1:27017",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "comp1842-mongo-2:27017",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "comp1842-mongo-3:27017",
        "priority": 0
      }
    ]
  };
  rs.initiate(cfg);
EOF
