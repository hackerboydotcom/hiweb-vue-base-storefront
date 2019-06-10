class JsonApi {

  constructor(data) {
    this.document = JSON.parse(JSON.stringify(data));
    this.cache = {};
  }

  /**
  * Merge data
  */
  merge(_data) {

    let data = JSON.parse(JSON.stringify(_data));

    if (typeof this.document.data === 'undefined') {
      this.document.data = [];
    }

    if (typeof this.document.included === 'undefined') {
      this.document.included = [];
    }

    // If data is array
    if (Array.isArray(data.data)) {
      this.document.data = this.document.data.concat(data.data);
    } else if (typeof data.data === 'object') {
      this.document.data.push(data.data);
    }

    // If included is array
    if (Array.isArray(data.included)) {
      this.document.included = this.document.included.concat(data.included);
    }

    return this.document;

  }

  /**
  * Remove data resource
  */
  removeDataResource(id) {

    if (typeof this.document.data === 'undefined') {
      return false;
    }

    if (Array.isArray(this.document.data)) {

      for (let i = 0; i < this.document.data.length; i++) {

        if (id === this.document.data[i].id) {
          this.document.data.splice(i, 1);
        }

      }

    }

  }

  /**
  * Find many relationship resources
  * Return an array of resources
  *
  * @param object Parent resource
  * @param string Relationship name
  * @return array
  */
  findRelationshipResources(resource, relationship, query, noCache) {

    if (typeof resource.relationships === 'undefined' || typeof resource.relationships[relationship] === 'undefined') {
      return null;
    }

    let relationships = resource.relationships[relationship].data;
    let relationshipToFind;
    
    if (relationships instanceof Array) {

      if (!relationships.length) {
        return null;
      }

      relationshipToFind = relationships;

    } else {

      if (!relationships) {
        return null;
      }

      relationshipToFind = [relationships];

    }

    let returnData = [];

    for (let i = 0; i < relationshipToFind.length; i++) {

      let found = this.findIncludedResource(relationshipToFind[i].type, relationshipToFind[i].id, noCache);

      if (!found) {
        continue;
      }

      let queryMatches = true;

      // If has query
      if (query) {

        for (let key in query) {

          // Break if query doesn't match
          if (found.attributes[key] !== query[key]) {
            queryMatches = false;
            continue;
          }

        }

      }

      if (!queryMatches) {
        continue;
      }

      returnData.push(found); 
    }

    return returnData;
  }

  /**
  * Find relationship resource matched
  * Return first resource if has many relationship
  *
  * @param object Parent resource
  * @param string Relationship name
  * @return object|null
  */
  findRelationshipResource(resource, relationship) {

    if (typeof resource.relationships === 'undefined' || typeof resource.relationships[relationship] === 'undefined') {
      return null;
    }

    let relationships = resource.relationships[relationship].data;

    let relationshipToFind;
    if (Array.isArray(relationships)) {

      if (!relationships.length) {
        return null;
      }

      relationshipToFind = relationships[0];

    } else {

      if (!relationships) {
        return null;
      }

      relationshipToFind = relationships;

    }

    // Find from included data
    return this.findIncludedResource(relationshipToFind.type, relationshipToFind.id);

  }

  /**
  * Find a resource in included data
  */
  findIncludedResource(type, id) {

    // Find in cache
    if (typeof this.cache[type + '-' + id] !== 'undefined') {
      return this.cache[type + '-' + id];
    }

    if (typeof this.document.included === 'undefined') {
      return null;
    }

    for (let i = 0; i < this.document.included.length; i++) {

      let object = this.document.included[i];

      if (object.type === type && object.id == id) {
        return this.cache[type + '-' + id] = object;
      }

    }

    return null;

  }
}

export default JsonApi;
