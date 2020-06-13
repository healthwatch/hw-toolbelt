module.exports = {
  parse: function(command) {
    var s = command.split('|');
    var n = s[0].split('.');
    var namespace = '';
    var name = '';
    if (n.length == 1) {
      name = n[0];
      namespace = 'Huh';
    } else {
      name = n[n.length - 1];
      namespace = s[0].replace('.' + name, '');
    }
    var c = new Class(namespace, name);
    var properties = s[1].split(',');
    properties.forEach(function(e, i) {
      var p = e.split(':');
      if (p.length == 1) {
        c.addProperty(new Property(p[0]));
      }
    });
    return c;
  }
};

class Class {
  constructor(namespace, name, properties = []) {
    this.namespace = namespace;
    this.name = name;
    this.properties = properties;
  }
  addProperty(p) {
    this.properties.push(p);
  }
  toString() {
    var p = '';
    this.properties.forEach(function(e, i) {
      p += '        public ' + e.type + ' ' + e.name + ' { get; set; }\n';
    });
    return `using System;
  
namespace __NAMESPACE__.Models
{
    public class __CLASS__
    {
        public int Id { get; set; }
__PROPERTIES__
    }
}`
      .replace('__NAMESPACE__', this.namespace)
      .replace(/__CLASS__/g, this.name)
      .replace('__PROPERTIES__', p);
  }
  toRepoString() {
    var cols = '';
    var vals = '';
    var params = '';
    var propVals = '';
    var colVals = '';
    var className = toCamelCase(this.name);
    var i = 0;
    this.properties.forEach(function(e, i) {
      cols += e.name;
      vals += '@' + e.name;
      params += 'new SqlParameter("@' + e.name + '", ' + className + '.' + e.name + ')';
      propVals += '                    ' + e.name + ' = DbHelper.GetString(rs, ' + (i + 1) + ')';
      colVals += e.name + ' = @' + e.name;
      if (i++ == 0) {
        cols += ', ';
        vals += ', ';
        params += ', ';
        propVals += ',\n';
        colVals += ', ';
      }
    });
    return `using System;
using System.Collections.Generic;
using System.Data.SqlClient;

using __NAMESPACE__.Models;
  
namespace __NAMESPACE__.Repositories.Sql
{
    public class Sql__CLASS__Repository
    {
        public List<__CLASS__> FindAll()
        {
            string query = @"
SELECT __CLASS__ID, __COLS__
FROM __CLASS__";
            var __VAR__s = new List<__CLASS__>();
            using (var rs = DbHelper.ExecuteReader(query)) {
              while (rs.Read()) {
                  var __VAR__ = new __CLASS__ {
                    Id = DbHelper.GetInt32(rs, 0),
__PROPVALS__
                  };
                  __VAR__s.Add(__VAR__);
              }
            }
            return __VAR__s;
        }

        public __CLASS__ Read(int id)
        {
            string query = @"
SELECT __CLASS__ID, __COLS__
FROM __CLASS__
WHERE __CLASS__ID = @__CLASS__ID";
            __CLASS__ __VAR__ = null;
            using (var rs = DbHelper.ExecuteReader(query, new SqlParameter("@__CLASS__ID", id))) {
              if (rs.Read()) {
                  __VAR__ = new __CLASS__ {
                    Id = DbHelper.GetInt32(rs, 0),
__PROPVALS__
                  };
              }
            }
            return __VAR__;
        }

        public void Save(__CLASS__ __VAR__)
        {
            string query = @"
INSERT INTO __CLASS__(__COLS__)
VALUES(__VALS__)";
            DbHelper.ExecuteNonQuery(query, __PARAMS__);
        }

        public void Update(__CLASS__ __VAR__, int id)
        {
            string query = @"
UPDATE __CLASS__ SET __COLVALS__
WHERE __CLASS__ID = @__CLASS__ID";
            DbHelper.ExecuteNonQuery(query, new SqlParameter("@__CLASS__ID", id), __PARAMS__);
        }

        public void Delete(int id)
        {
            string query = @"
DELETE FROM __CLASS__
WHERE __CLASS__ID = @__CLASS__ID";
            DbHelper.ExecuteNonQuery(query, new SqlParameter("@__CLASS__ID", id));
        }
    }
}`
      .replace('__NAMESPACE__', this.namespace)
      .replace(/__CLASS__/g, this.name)
      .replace(/__COLS__/g, cols)
      .replace(/__VALS__/g, vals)
      .replace(/__PARAMS__/g, params)
      .replace(/__PROPVALS__/g, propVals)
      .replace(/__COLVALS__/g, colVals)
      .replace(/__VAR__/g, toCamelCase(this.name));
  }
}

class Property {
  constructor(name, type = 'string') {
    this.name = name;
    this.type = type;
  }
}

function toCamelCase(s) {
  if (s.length > 0) {
    return s[0].toLowerCase() + s.substr(1);
  }
  return "";
}
