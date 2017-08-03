const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports = (TableName) => {
  const putItem = item => (
    new Promise((resolve, reject) => {
      dynamoDb.put({
        TableName,
        Item: item,
      }, (err, result) => {
        if (err) {
          return reject({
            statusCode: 500,
            code: err.code,
          });
        }

        return resolve(result);
      });
    })
  );

  const retrieveOne = id => (
    new Promise((resolve, reject) => {
      dynamoDb.get({
        TableName,
        Key: {
          id,
        },
      }, (err, result) => {
        if (err) {
          return reject({
            statusCode: 500,
            code: err.code,
          });
        }

        return resolve(result);
      });
    })
  );

  const retrieveAll = () => (
    new Promise((resolve, reject) => {
      dynamoDb.delete({
        TableName,
        IndexName: 'id',
      }, (err, result) => {
        if (err) {
          return reject({
            statusCode: 500,
            code: err.code,
          });
        }

        return resolve(result);
      });
    })
  );

  const remove = id => (
    new Promise((resolve, reject) => {
      dynamoDb.deleteItem({
        TableName,
        Key: {
          id,
        },
      }, (err, result) => {
        if (err) {
          return reject({
            statusCode: 500,
            code: err.code,
          });
        }

        return resolve(result);
      });
    })
  );

  return {
    putItem,
    remove,
    retrieveAll,
    retrieveOne,
  };
};
