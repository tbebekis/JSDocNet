using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Represents the global namespace.
    /// <para>Is the root in a tree of items</para>
    /// <para>Maintains a flat list of all DocItem items produced by parsing the javascript sources.</para>
    /// </summary>
    public class DocItemGlobal : DocItem
    {

        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        internal DocItemGlobal(Parser Parser)
            : base(Parser, null, DocItemType.Global)
        {
            FlatList = new List<DocItem>();
            ContextName = string.Empty;
        }

        /* public */
        internal void AddToFlatList(DocItem Item)
        {
            if (FindFlat(Item.FullName) == null)
            {
                FlatList.Add(Item);

                if (IsTopItem(Item))
                {
                    this.ContextName = Item.FullName;
                }
            }
        }
        internal void Fixup()
        {
            DocItem Item;
            for (int i = 0; i < FlatList.Count; i++)
            {
                Item = FlatList[i];
                if (Item != this)
                    Item.FindParent();
            }

            Sort();


            // sort the flat list too
            this.FlatList = this.FlatList.OrderBy(o => o.FullName).ToList();
        }

        /// <summary>
        /// Finds and returns an item specified by its full-name (MemberOf.Name) scanning the internal flat list of items, if any, else null.
        /// </summary>
        public DocItem FindFlat(string FullName)
        {
            if (string.IsNullOrWhiteSpace(FullName) || (FullName == "global"))
                return this;

            foreach (DocItem Item in FlatList)
            {
                if (Item.FullName == FullName)
                    return Item;
            }

            return null;
        }
        /// <summary>
        /// Returns a list of items, scanning the internal flat list of items, of a specified type
        /// </summary>
        public List<DocItem> GetAll(DocItemType ItemType)
        {
            List<DocItem> Result = new List<DocItem>();
            foreach (var Item in this.FlatList)
            {
                if (Item.ItemType == ItemType)
                    Result.Add(Item);
            }

            return Result;
        }
        /// <summary>
        /// Returns a list of items, scanning the internal flat list of items, of a specified type
        /// </summary>
        public List<DocItem> GetAllNamespaces()
        {
            return GetAll(DocItemType.Namespace);
        }
        /// <summary>
        /// Returns a list of items, scanning the internal flat list of items, of a specified type
        /// </summary>
        public List<DocItem> GetAllClasses()
        {
            return GetAll(DocItemType.Class);
        }
        /// <summary>
        /// Returns a list of items, scanning the internal flat list of items, of a specified type
        /// </summary>
        public List<DocItem> GetAllEnums()
        {
            return GetAll(DocItemType.Enum);
        }

        /// <summary>
        /// True if an item is a top item, i.e. namespace, class, enum or interface
        /// </summary>
        public bool IsTopItem(DocItem Item)
        {
            return IsTopItem(Item.ItemType);
        }
        /// <summary>
        /// True if an item is a top item, i.e. namespace, class, enum or interface
        /// </summary>
        public bool IsTopItem(DocItemType ItemType)
        {
            bool Result = ItemType == DocItemType.Namespace || ItemType == DocItemType.Class || ItemType == DocItemType.Enum || ItemType == DocItemType.Interface;
            return Result;
        }

        /* properties */
        /// <summary>
        /// Used while parsing
        /// </summary>
        internal string ContextName { get; set; }
        /// <summary>
        /// The flat-list. Contains all DocItem items produced by parsing the javascript sources
        /// </summary>
        public List<DocItem> FlatList { get; protected set; }    
    }



}
