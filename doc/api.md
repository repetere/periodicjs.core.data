## Classes

<dl>
<dt><a href="#Mongo_Adapter">Mongo_Adapter</a></dt>
<dd></dd>
<dt><a href="#MONGO_ADAPTER">MONGO_ADAPTER</a></dt>
<dd></dd>
<dt><a href="#DB_ADAPTER_INTERFACE">DB_ADAPTER_INTERFACE</a></dt>
<dd><p>Interface class - defines properties and property types that should exist within constructed classes</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#_QUERY">_QUERY(options, cb)</a></dt>
<dd><p>Convenience method for .find mongo method</p>
</dd>
<dt><a href="#_STREAM">_STREAM(options, cb)</a></dt>
<dd><p>Convenience method for returning a stream of mongo data</p>
</dd>
<dt><a href="#_QUERY_WITH_PAGINATION">_QUERY_WITH_PAGINATION(options, cb)</a></dt>
<dd><p>Convenience method for .find mongo method with built in pagination of data</p>
</dd>
<dt><a href="#_SEARCH">_SEARCH(options, cb)</a></dt>
<dd><p>Convenience method for .find mongo method with built in query builder functionality</p>
</dd>
<dt><a href="#_LOAD">_LOAD(options, cb)</a></dt>
<dd><p>Convenience method for .findOne or .findById mongoose methods</p>
</dd>
<dt><a href="#GENERATE_PATCH">GENERATE_PATCH(data)</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a mongoose update operation that only uses $set and $push</p>
</dd>
<dt><a href="#GENERATE_PUT">GENERATE_PUT(data)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns a cleaned object for a full document update</p>
</dd>
<dt><a href="#_UPDATE">_UPDATE(options, cb)</a></dt>
<dd><p>Convenience method for .update mongo method</p>
</dd>
<dt><a href="#_UPDATED">_UPDATED(options, cb)</a></dt>
<dd><p>Convenience method for .findAndUpdate mongoose method (returns updated document instead of normal mongo update status object)</p>
</dd>
<dt><a href="#_CREATE">_CREATE(options, cb)</a></dt>
<dd><p>Convenience method for .create mongoose method</p>
</dd>
<dt><a href="#_DELETE">_DELETE(options, cb)</a></dt>
<dd><p>Convenience method for .remove mongoose method</p>
</dd>
<dt><a href="#_DELETED">_DELETED(options, cb)</a></dt>
<dd><p>Convenience method for .remove mongoose method but returns the deleted document</p>
</dd>
</dl>

<a name="Mongo_Adapter"></a>

## Mongo_Adapter
**Kind**: global class  
<a name="new_Mongo_Adapter_new"></a>

### new Mongo_Adapter()
An mongoose specific adapter which provides CRUD methods for a given model

<a name="MONGO_ADAPTER"></a>

## MONGO_ADAPTER
**Kind**: global class  

* [MONGO_ADAPTER](#MONGO_ADAPTER)
    * [new MONGO_ADAPTER([options])](#new_MONGO_ADAPTER_new)
    * [.query([options], [cb])](#MONGO_ADAPTER+query) ⇒ <code>Object</code>
    * [.search([options], [cb])](#MONGO_ADAPTER+search) ⇒ <code>Object</code>
    * [.stream([options], [cb])](#MONGO_ADAPTER+stream) ⇒ <code>Object</code>
    * [.load([options], [cb])](#MONGO_ADAPTER+load) ⇒ <code>Object</code>
    * [.update([options], [cb])](#MONGO_ADAPTER+update) ⇒ <code>Object</code>
    * [.create([options], [cb])](#MONGO_ADAPTER+create) ⇒ <code>Object</code>
    * [.delete([options], [cb])](#MONGO_ADAPTER+delete) ⇒ <code>Object</code>

<a name="new_MONGO_ADAPTER_new"></a>

### new MONGO_ADAPTER([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for the mongo adapter |
| options.docid | <code>string</code> |  | Specifies the field which should be queried by default for .load |
| options.model | <code>Object</code> |  | Mongoose model that should be used in CRUD operations by default |
| [options.sort] | <code>Object</code> &#124; <code>string</code> | <code>&quot;-createdat&quot;</code> | Specifies default sort logic for .query and .search queries |
| [options.db_connection] | <code>Object</code> | <code>mongoose</code> | A custom mongoose db instance if connecting to a different mongoose instance. Will default to cached mongoose connection if not passed. If this option is defined the changeset scheam will be registered on this instance. |
| [options.limit] | <code>number</code> | <code>500</code> | Specifies a default limit to the total documents returned in a .query and .search queries |
| [options.skip] | <code>number</code> | <code>0</code> | Specifies a default amount of documents to skip in a .query and .search queries |
| [options.population] | <code>Object</code> &#124; <code>string</code> |  | Optional population configuration for documents returned in .load and .search queries |
| [options.fields] | <code>Object</code> |  | Optional configuration for limiting fields that are returned in .load and .search queries |
| [options.pagelength] | <code>number</code> | <code>15</code> | Specifies max number of documents that should appear in each sub-set for pagination |
| [options.track_changes] | <code>Boolean</code> | <code>true</code> | Sets default track changes behavior for udpates |
| [options.xss_whitelist] | <code>Array.&lt;string&gt;</code> | <code>false</code> | Configuration for XSS whitelist package. If false XSS whitelisting will be ignored |

<a name="MONGO_ADAPTER+query"></a>

### mongO_ADAPTER.query([options], [cb]) ⇒ <code>Object</code>
Query method for adapter see _QUERY and _QUERY_WITH_PAGINATION for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for query |
| options.paginate | <code>Boolean</code> |  | When true query will return data in a paginated form |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER+search"></a>

### mongO_ADAPTER.search([options], [cb]) ⇒ <code>Object</code>
Search method for adapter see _SEARCH for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for query |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER+stream"></a>

### mongO_ADAPTER.stream([options], [cb]) ⇒ <code>Object</code>
Stream method for adapter see _STREAM for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for stream |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER+load"></a>

### mongO_ADAPTER.load([options], [cb]) ⇒ <code>Object</code>
Load method for adapter see _LOAD for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for load |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER+update"></a>

### mongO_ADAPTER.update([options], [cb]) ⇒ <code>Object</code>
Update method for adapter see _UPDATE and _UPDATED for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for update |
| options.return_updated | <code>Boolean</code> |  | If true update method will return the updated document instead of an update status message |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER+create"></a>

### mongO_ADAPTER.create([options], [cb]) ⇒ <code>Object</code>
Create method for adapter see _CREATE for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for create |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER+delete"></a>

### mongO_ADAPTER.delete([options], [cb]) ⇒ <code>Object</code>
Delete method for adapter see _DELETE and _DELETED for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for create |
| options.return_deleted | <code>Boolean</code> |  | If true delete method will return the deleted document |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="DB_ADAPTER_INTERFACE"></a>

## DB_ADAPTER_INTERFACE
Interface class - defines properties and property types that should exist within constructed classes

**Kind**: global class  

* [DB_ADAPTER_INTERFACE](#DB_ADAPTER_INTERFACE)
    * [new DB_ADAPTER_INTERFACE([options])](#new_DB_ADAPTER_INTERFACE_new)
    * [.create([options])](#DB_ADAPTER_INTERFACE+create) ⇒ <code>Object</code>

<a name="new_DB_ADAPTER_INTERFACE_new"></a>

### new DB_ADAPTER_INTERFACE([options])
Creates an interface


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | A set of properties defined by keys with their allowed types as values. Each property will be required by newly constructed classes from this interface |

<a name="DB_ADAPTER_INTERFACE+create"></a>

### dB_ADAPTER_INTERFACE.create([options]) ⇒ <code>Object</code>
Constructs a new object with a prototype defined by the .adapter ensuring that instantiated class conforms to interface requirements

**Kind**: instance method of <code>[DB_ADAPTER_INTERFACE](#DB_ADAPTER_INTERFACE)</code>  
**Returns**: <code>Object</code> - Returns an instantiated adapter class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Values to be passed to class constructor (.adapter should be reserved for either customer class or string that matches key in ADAPTERS) |
| options.adapter | <code>string</code> &#124; <code>function</code> |  | Required to specify type of adapter to be constructed or a class constructor that can be instantiated with new keyword |
| options.db | <code>string</code> &#124; <code>function</code> |  | Alias for options.adapter. If options.db is defined options.adapter will be ignored |

<a name="_QUERY"></a>

## _QUERY(options, cb)
Convenience method for .find mongo method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the mongo query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The mongoose population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for query |

<a name="_STREAM"></a>

## _STREAM(options, cb)
Convenience method for returning a stream of mongo data

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the mongo query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The mongoose population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for stream |

<a name="_QUERY_WITH_PAGINATION"></a>

## _QUERY_WITH_PAGINATION(options, cb)
Convenience method for .find mongo method with built in pagination of data

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the mongo query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.pagelength] | <code>number</code> | <code>this.pagelength</code> | Defines the max length of each sub-set of data |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The mongoose population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for query |

<a name="_SEARCH"></a>

## _SEARCH(options, cb)
Convenience method for .find mongo method with built in query builder functionality

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the mongo query |
| [options.query] | <code>Object</code> &#124; <code>string</code> |  | The query that should be used for the database search. If this value is a string it will be treated as a delimited list of values to use in query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.pagelength] | <code>number</code> | <code>this.pagelength</code> | Defines the max length of each sub-set of data |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The mongoose population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| [options.search] | <code>Array.&lt;string&gt;</code> | <code>this.searchfields</code> | Used in building the query. A separate $or statement is appended into query array for each search field specified ie. ['a','b'] => { $or: [{a: ..., b ...}] } |
| [options.delimeter] | <code>string</code> | <code>&quot;\&quot;|||\&quot;&quot;</code> | The value that the query values are delimeted by. If options.query is an object this value is ignored |
| [options.docid] | <code>string</code> | <code>&quot;this.docid&quot;</code> | When using options.values this specifies the name of the field that should be matched |
| [options.values] | <code>string</code> |  | A comma separated list of values to be queried against docid or "_id" if docid is not specified |
| options.paginate | <code>Boolean</code> |  | If true documents will be returned in a paginated format |
| cb | <code>function</code> |  | Callback function for query |

<a name="_LOAD"></a>

## _LOAD(options, cb)
Convenience method for .findOne or .findById mongoose methods

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The mongoose population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.docid] | <code>string</code> | <code>&quot;\&quot;_id\&quot;&quot;</code> | A field that should be queried will default to "_id" |
| options.query | <code>Object</code> &#124; <code>string</code> &#124; <code>number</code> |  | If value is an object query will be set to the value otherwise a query will be built based on options.docid and any other value provided in options.query |
| cb | <code>function</code> |  | Callback function for load |

<a name="GENERATE_PATCH"></a>

## GENERATE_PATCH(data) ⇒ <code>Object</code>
Creates a mongoose update operation that only uses $set and $push

**Kind**: global function  
**Returns**: <code>Object</code> - Returns an object with $set and $push properties  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Any fields that should be updated as part of patch |

<a name="GENERATE_PUT"></a>

## GENERATE_PUT(data) ⇒ <code>Object</code>
Returns a cleaned object for a full document update

**Kind**: global function  
**Returns**: <code>Object</code> - Returns original object with reserved fields removed  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | A full document with updated data for put |

<a name="_UPDATE"></a>

## _UPDATE(options, cb)
Convenience method for .update mongo method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo update |
| options.isPatch | <code>Boolean</code> |  | If true the update will be treated as a patch instead of a full document update |
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updatedated document |
| options.id | <code>string</code> |  | The mongo _id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_UPDATED"></a>

## _UPDATED(options, cb)
Convenience method for .findAndUpdate mongoose method (returns updated document instead of normal mongo update status object)

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo update |
| options.isPatch | <code>Boolean</code> |  | If true the update will be treated as a patch instead of a full document update |
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updatedated document |
| options.id | <code>string</code> |  | The mongo _id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_CREATE"></a>

## _CREATE(options, cb)
Convenience method for .create mongoose method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo create |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.newdoc] | <code>Object</code> | <code>options</code> | The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.xss_whitelist] | <code>Object</code> | <code>this.xss_whitelist</code> | XSS white-list configuration for xss npm module |
| cb | <code>function</code> |  | Callback function for create |

<a name="_DELETE"></a>

## _DELETE(options, cb)
Convenience method for .remove mongoose method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo delete |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| options.deleteid | <code>string</code> |  | The mongo id of the document that should be removed |
| options.id | <code>string</code> |  | If options.deleteid is provided this value is ignored - alias for options.deleteid |
| cb | <code>function</code> |  | Callback function for delete |

<a name="_DELETED"></a>

## _DELETED(options, cb)
Convenience method for .remove mongoose method but returns the deleted document

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo delete |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| options.deleteid | <code>string</code> |  | The mongo id of the document that should be removed |
| options.id | <code>string</code> |  | If options.deleteid is provided this value is ignored - alias for options.deleteid |
| cb | <code>function</code> |  | Callback function for delete |

