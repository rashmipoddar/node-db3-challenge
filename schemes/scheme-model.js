const db = require('../data/db-config');

const find = () => {
  return db('schemes');
}

const findById = (id) => {
  return db('schemes')
    .where({id})  
    .first();
}

function findSteps(id) {
  // SELECT schemes.scheme_name, steps.step_number, steps.instructions
  // FROM schemes
  // JOIN steps ON schemes.id = steps.scheme_id
  // WHERE schemes.id = 1
  // ORDER BY steps.step_number;

  return db
    .select('steps.id', 'schemes.scheme_name', 'steps.step_number', 'steps.instructions')
    .from('schemes')
    .innerJoin('steps', 'schemes.id', 'steps.scheme_id') 
    .where({'schemes.id': id})
    .orderBy('steps.step_number')
}

const add = scheme => {
  return db('schemes')
    .insert(scheme)
    // .then(ids => ({ id: ids[0] }));
    .then(ids => {
      console.log(ids);
      return findById(ids[0]);
    })
}

const update = (id, changes) => {
  console.log('----', changes, '------');
  return db('schemes')
    .where({id})
    .update(changes)
    .then(count => {
      console.log(count);
      if (count !== 0) {
        return findById(id);
      }
    })
}

const remove = (id) => {
  findById(id)
    .then(scheme => {
      console.log('=====', scheme, '=====');
      if (scheme) {
        return db('schemes')
          .where({id})
          .del()
          .then(count => {
            return scheme;
          })
      } else {
        return 'The scheme with the given id does not exist';
      }
    })
    .catch(error => {
      return 'The scheme could not be deleted';
    })
    // return db('schemes')
    // .where({id})
    // .del()
}

module.exports = {
  find,
  findById,
  findSteps,
  add, 
  update,
  remove
}