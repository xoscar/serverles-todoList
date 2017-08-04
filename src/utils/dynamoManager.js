const aws = require('aws-sdk'); // eslint-disable-line

const dynamoDb = new aws.DynamoDB.DocumentClient();

// internal functions
const generateSearchParams = (searchParams, typeConfig) => {
  if (Object.keys(searchParams).length === 0) {
    return {};
  }

  const FilterExpression = Object.keys(searchParams).map(key => (
    typeConfig[key] === 'regexp' ? `begins_with(info.${key}, :${key})` : `info.${key} = :${key}`
  )).join(' and ');

  const ExpressionAttributeValues = Object.keys(searchParams).map(key => ({
    [':' + key]: typeConfig[key] === 'boolean' ? searchParams[key] === 'true' : searchParams[key],
  })).reduce((a, b) => (
    Object.assign(a, b)
  ), {});

  return {
    FilterExpression,
    ExpressionAttributeValues,
  };
};

module.exports = (TableName) => {
  const putItem = item => (
    new Promise((resolve, reject) => {
      dynamoDb.put({
        TableName,
        Item: item,
      }, (err) => {
        if (err) {
          return reject({
            statusCode: 500,
            code: err.code,
          });
        }

        return resolve(item);
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

        if (!result.Item) {
          return reject({
            statusCode: 404,
            code: 'Not foud.',
          });
        }

        return resolve(result.Item);
      });
    })
  );

  const retrieveAll = (searchOptions, typeConfig) => (
    new Promise((resolve, reject) => {
      dynamoDb.scan(Object.assign(generateSearchParams(searchOptions, typeConfig), {
        TableName,
      }), (err, result) => {
        if (err) {
          return reject({
            statusCode: 500,
            code: err.code,
          });
        }

        return resolve({
          results: result.Items,
          hits: result.ScannedCount,
        });
      });
    })
  );

  const remove = id => (
    new Promise((resolve, reject) => {
      dynamoDb.delete({
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
