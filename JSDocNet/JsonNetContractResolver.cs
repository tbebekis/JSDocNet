using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

 


namespace JSDocNet
{


    /// <summary>
    /// Used in excluding properties when serializing.
    /// <para>E.g. JsonConvert.SerializeObject(Instance, Formatting.Indented, new JsonSerializerSettings { ContractResolver = new JsonNetContractResolver(ExcludeProperties) }) </para>
    /// </summary>
    public class JsonNetContractResolver : DefaultContractResolver
    {
        /* private */
        string[] ExcludeProperties = new string[0];

        /* overrides */
        /// <summary>
        /// Override.  Creates properties for the given Newtonsoft.Json.Serialization.JsonContract.
        /// </summary>
        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            IList<JsonProperty> properties = base.CreateProperties(type, memberSerialization);
            properties = properties.Where(p => !ExcludeProperties.ContainsText(p.PropertyName)).ToList();
            return properties;
        }


        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public JsonNetContractResolver()
        {
        }
        /// <summary>
        /// Constructor
        /// </summary>
        public JsonNetContractResolver(string[] ExcludeProperties)
        {
            this.ExcludeProperties = ExcludeProperties;
        }


    }
}
