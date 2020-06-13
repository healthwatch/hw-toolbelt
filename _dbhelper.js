module.exports = {
  toString: function(namespace) {
    return `using System;
using System.Data.SqlClient;
  
namespace __NAMESPACE__.Helpers
{
    public static class DbHelper
    {
        public static int GetInt32(SqlDataReader reader, int index)
        {
            return GetInt32(reader, index, 0);
        }

        public static int GetInt32(SqlDataReader reader, int index, int defaultValue)
        {
            return reader.IsDBNull(index) ? defaultValue : reader.GetInt32(index);
        }

        public static int GetString(SqlDataReader reader, int index)
        {
            return GetInt32(reader, index, "");
        }

        public static int GetString(SqlDataReader reader, int index, string defaultValue)
        {
            return reader.IsDBNull(index) ? defaultValue : reader.GetString(index);
        }
    }
}`
      .replace('__NAMESPACE__', namespace);
  }
};