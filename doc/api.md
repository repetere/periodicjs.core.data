## Classes

<dl>
<dt><a href="#LOKI_ADAPTER">LOKI_ADAPTER</a> : <code>Loki_Adapter</code></dt>
<dd><p>A lowkie specific adapter which provides CRUD methods for a given model</p>
</dd>
<dt><a href="#MONGO_ADAPTER">MONGO_ADAPTER</a> : <code>Mongo_Adapter</code></dt>
<dd><p>A mongoose specific adapter which provides CRUD methods for a given model</p>
</dd>
<dt><a href="#SQL_ADAPTER">SQL_ADAPTER</a> : <code>SQL_Adapter</code></dt>
<dd><p>A sequelize SQL specific adapter which provides CRUD methods for a given model</p>
</dd>
<dt><a href="#CURSOR">CURSOR</a> : <code>Cursor</code></dt>
<dd><p>A simple cursor-like implementation that combines generator and stream functionality. Cursor exposes all the normal stream methods such as pipe, unpipe, on, once etc as well as an initialize method that returns a generator and allows for documents to be iteratively resolved. Using both the generator based cursor interface and stream interface concurrently is not recommended as both utilize the TransformStream on data, on error and on finish events and as such will likely cause unpredictable behavior</p>
</dd>
<dt><a href="#DB_ADAPTER_INTERFACE">DB_ADAPTER_INTERFACE</a></dt>
<dd><p>Interface class - defines properties and property types that should exist within constructed classes</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#_QUERY">_QUERY(options, cb)</a></dt>
<dd><p>Convenience method for .find loki method</p>
</dd>
<dt><a href="#_STREAM">_STREAM(options, cb)</a></dt>
<dd><p>Convenience method for returning a stream of loki data</p>
</dd>
<dt><a href="#_QUERY_WITH_PAGINATION">_QUERY_WITH_PAGINATION(options, cb)</a></dt>
<dd><p>Convenience method for .find loki method with built in pagination of data</p>
</dd>
<dt><a href="#_SEARCH">_SEARCH(options, cb)</a></dt>
<dd><p>Convenience method for .find loki method with built in query builder functionality</p>
</dd>
<dt><a href="#_LOAD">_LOAD(options, cb)</a></dt>
<dd><p>Convenience method for .findOne or .findById lowkie methods</p>
</dd>
<dt><a href="#GENERATE_PATCH">GENERATE_PATCH(data)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a lowkie update operation</p>
</dd>
<dt><a href="#GENERATE_PUT">GENERATE_PUT(data)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns a cleaned object for a full document update</p>
</dd>
<dt><a href="#_UPDATE">_UPDATE(options, cb)</a></dt>
<dd><p>Convenience method for .update loki method</p>
</dd>
<dt><a href="#_UPDATED">_UPDATED(options, cb)</a></dt>
<dd><p>Convenience method for .findAndUpdate lowkie method (returns updated document instead of normal loki update status object)</p>
</dd>
<dt><a href="#_UPDATE_ALL">_UPDATE_ALL(options, cb)</a></dt>
<dd><p>Convenience method for .update with the multi options set to true for multiple document updates</p>
</dd>
<dt><a href="#_CREATE">_CREATE(options, cb)</a></dt>
<dd><p>Convenience method for .create lowkie method</p>
</dd>
<dt><a href="#_DELETE">_DELETE(options, cb)</a></dt>
<dd><p>Convenience method for .remove lowkie method</p>
</dd>
<dt><a href="#_DELETED">_DELETED(options, cb)</a></dt>
<dd><p>Convenience method for .remove lowkie method but returns the deleted document</p>
</dd>
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
<dt><a href="#_UPDATE_ALL">_UPDATE_ALL(options, cb)</a></dt>
<dd><p>Convenience method for .update with the multi options set to true for multiple document updates</p>
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
<dt><a href="#GENERATE_SELECT">GENERATE_SELECT(fields)</a></dt>
<dd><p>Takes a set of fields either as a comma delimited list or a mongoose style fields object and converts them into a sequelize compatible array</p>
</dd>
<dt><a href="#_QUERY">_QUERY(options, cb)</a></dt>
<dd><p>Convenience method for .findAll sequelize method</p>
</dd>
<dt><a href="#_STREAM">_STREAM(options, cb)</a></dt>
<dd><p>Convenience method for returning a stream of sql data. Since sequelize does not expose a cursor or stream method this is an implementation of a cursor on top of a normal SQL query</p>
</dd>
<dt><a href="#_QUERY_WITH_PAGINATION">_QUERY_WITH_PAGINATION(options, cb)</a></dt>
<dd><p>Convenience method for .findAll SQL method with built in pagination of data</p>
</dd>
<dt><a href="#_SEARCH">_SEARCH(options, cb)</a></dt>
<dd><p>Convenience method for .findAll SQL method with built in query builder functionality</p>
</dd>
<dt><a href="#_LOAD">_LOAD(options, cb)</a></dt>
<dd><p>Convenience method for .findOne sequelize methods</p>
</dd>
<dt><a href="#_UPDATE">_UPDATE(options, cb)</a></dt>
<dd><p>Convenience method for .update SQL method</p>
</dd>
<dt><a href="#_UPDATED">_UPDATED(options, cb)</a></dt>
<dd><p>Convenience method for .update + .findOne sequelize method (returns updated document instead of normal number updated status)</p>
</dd>
<dt><a href="#_UPDATE_ALL">_UPDATE_ALL(options, cb)</a></dt>
<dd><p>Convenience method for .update for multiple document updates</p>
</dd>
<dt><a href="#_CREATE">_CREATE(options, cb)</a></dt>
<dd><p>Convenience method for .create sequelize method</p>
</dd>
<dt><a href="#_DELETE">_DELETE(options, cb)</a></dt>
<dd><p>Convenience method for .destroy sequelize method</p>
</dd>
<dt><a href="#_DELETED">_DELETED(options, cb)</a></dt>
<dd><p>Convenience method for .destroy sequelize method but returns the deleted document</p>
</dd>
<dt><a href="#_RAW">_RAW(options, cb)</a></dt>
<dd><p>Convenience method for .query sequelize method that allows for raw SQL queries</p>
</dd>
<dt><a href="#defaultSuccess">defaultSuccess(data)</a> ⇒ <code>*</code></dt>
<dd><p>A default on success function for each iteration of cursor</p>
</dd>
<dt><a href="#defaultError">defaultError(e)</a> ⇒ <code>Object</code></dt>
<dd><p>A default on error function for each iteration of cursor</p>
</dd>
</dl>

<a name="LOKI_ADAPTER"></a>

## LOKI_ADAPTER : <code>Loki_Adapter</code>
A lowkie specific adapter which provides CRUD methods for a given model

**Kind**: global class  

* [LOKI_ADAPTER](#LOKI_ADAPTER) : <code>Loki_Adapter</code>
    * [new LOKI_ADAPTER([options])](#new_LOKI_ADAPTER_new)
    * [.query([options], [cb])](#LOKI_ADAPTER+query) ⇒ <code>Object</code>
    * [.search([options], [cb])](#LOKI_ADAPTER+search) ⇒ <code>Object</code>
    * [.stream([options], [cb])](#LOKI_ADAPTER+stream) ⇒ <code>Object</code>
    * [.load([options], [cb])](#LOKI_ADAPTER+load) ⇒ <code>Object</code>
    * [.update([options], [cb])](#LOKI_ADAPTER+update) ⇒ <code>Object</code>
    * [.create([options], [cb])](#LOKI_ADAPTER+create) ⇒ <code>Object</code>
    * [.delete([options], [cb])](#LOKI_ADAPTER+delete) ⇒ <code>Object</code>

<a name="new_LOKI_ADAPTER_new"></a>

### new LOKI_ADAPTER([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for the loki adapter |
| options.docid | <code>string</code> |  | Specifies the field which should be queried by default for .load |
| options.model | <code>Object</code> |  | Mongoose model that should be used in CRUD operations by default |
| [options.sort] | <code>Object</code> &#124; <code>string</code> | <code>&quot;-createdat&quot;</code> | Specifies default sort logic for .query and .search queries |
| [options.db_connection] | <code>Object</code> | <code>lowkie</code> | A custom lowkie db instance if connecting to a different lowkie instance. Will default to cached lowkie connection if not passed. If this option is defined the changeset scheam will be registered on this instance. |
| [options.limit] | <code>number</code> | <code>500</code> | Specifies a default limit to the total documents returned in a .query and .search queries |
| [options.skip] | <code>number</code> | <code>0</code> | Specifies a default amount of documents to skip in a .query and .search queries |
| [options.population] | <code>Object</code> &#124; <code>string</code> |  | Optional population configuration for documents returned in .load and .search queries |
| [options.fields] | <code>Object</code> |  | Optional configuration for limiting fields that are returned in .load and .search queries |
| [options.pagelength] | <code>number</code> | <code>15</code> | Specifies max number of documents that should appear in each sub-set for pagination |
| [options.track_changes] | <code>Boolean</code> | <code>true</code> | Sets default track changes behavior for udpates |
| [options.xss_whitelist] | <code>Array.&lt;string&gt;</code> | <code>false</code> | Configuration for XSS whitelist package. If false XSS whitelisting will be ignored |

<a name="LOKI_ADAPTER+query"></a>

### lokI_ADAPTER.query([options], [cb]) ⇒ <code>Object</code>
Query method for adapter see _QUERY and _QUERY_WITH_PAGINATION for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for query |
| options.paginate | <code>Boolean</code> |  | When true query will return data in a paginated form |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="LOKI_ADAPTER+search"></a>

### lokI_ADAPTER.search([options], [cb]) ⇒ <code>Object</code>
Search method for adapter see _SEARCH for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for query |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="LOKI_ADAPTER+stream"></a>

### lokI_ADAPTER.stream([options], [cb]) ⇒ <code>Object</code>
Stream method for adapter see _STREAM for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for stream |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="LOKI_ADAPTER+load"></a>

### lokI_ADAPTER.load([options], [cb]) ⇒ <code>Object</code>
Load method for adapter see _LOAD for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for load |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="LOKI_ADAPTER+update"></a>

### lokI_ADAPTER.update([options], [cb]) ⇒ <code>Object</code>
Update method for adapter see _UPDATE, _UPDATED and _UPDATE_ALL for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for update |
| options.return_updated | <code>Boolean</code> |  | If true update method will return the updated document instead of an update status message |
| options.multi | <code>Boolean</code> |  | If true a multiple document update will be perfomed |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="LOKI_ADAPTER+create"></a>

### lokI_ADAPTER.create([options], [cb]) ⇒ <code>Object</code>
Create method for adapter see _CREATE for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for create |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="LOKI_ADAPTER+delete"></a>

### lokI_ADAPTER.delete([options], [cb]) ⇒ <code>Object</code>
Delete method for adapter see _DELETE and _DELETED for more details

**Kind**: instance method of <code>[LOKI_ADAPTER](#LOKI_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for create |
| options.return_deleted | <code>Boolean</code> |  | If true delete method will return the deleted document |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="MONGO_ADAPTER"></a>

## MONGO_ADAPTER : <code>Mongo_Adapter</code>
A mongoose specific adapter which provides CRUD methods for a given model

**Kind**: global class  

* [MONGO_ADAPTER](#MONGO_ADAPTER) : <code>Mongo_Adapter</code>
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
Update method for adapter see _UPDATE, _UPDATED and _UPDATE_ALL for more details

**Kind**: instance method of <code>[MONGO_ADAPTER](#MONGO_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for update |
| options.return_updated | <code>Boolean</code> |  | If true update method will return the updated document instead of an update status message |
| options.multi | <code>Boolean</code> |  | If true a multiple document update will be perfomed |
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

<a name="SQL_ADAPTER"></a>

## SQL_ADAPTER : <code>SQL_Adapter</code>
A sequelize SQL specific adapter which provides CRUD methods for a given model

**Kind**: global class  

* [SQL_ADAPTER](#SQL_ADAPTER) : <code>SQL_Adapter</code>
    * [new SQL_ADAPTER(options)](#new_SQL_ADAPTER_new)
    * [.sync([options], [cb])](#SQL_ADAPTER+sync) ⇒ <code>Object</code>
    * [.query([options], [cb])](#SQL_ADAPTER+query) ⇒ <code>Object</code>
    * [.search([options], [cb])](#SQL_ADAPTER+search) ⇒ <code>Object</code>
    * [.stream([options], [cb])](#SQL_ADAPTER+stream) ⇒ <code>Object</code>
    * [.load([options], [cb])](#SQL_ADAPTER+load) ⇒ <code>Object</code>
    * [.update([options], [cb])](#SQL_ADAPTER+update) ⇒ <code>Object</code>
    * [.create([options], [cb])](#SQL_ADAPTER+create) ⇒ <code>Object</code>
    * [.delete([options], [cb])](#SQL_ADAPTER+delete) ⇒ <code>Object</code>
    * [.raw(options, cb)](#SQL_ADAPTER+raw) ⇒ <code>Object</code>

<a name="new_SQL_ADAPTER_new"></a>

### new SQL_ADAPTER(options)
Constructor for SQL_Adapter


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for the SQL adapter |
| options.db_connection | <code>Object</code> &#124; <code>Array.&lt;string&gt;</code> |  | Either a instantiated instance of Sequelize or the connection details for a instance as an array of ordered arguments or options object |
| [options.db_connetion.db_name] | <code>string</code> |  | Name of the database (only used if instantiating a new Sequelize instance) |
| [options.db_connetion.db_user] | <code>string</code> |  | Username for the database (only used if instantiating a new Sequelize instance) |
| [options.db_connetion.db_password] | <code>string</code> |  | Password for the database (only used if instantiating a new Sequelize instance) |
| [options.db_connetion.db_options] | <code>string</code> |  | Options for connection to the database ie. port, hostname (only used if instantiating a new Sequelize instance) |
| [options.docid] | <code>string</code> | <code>&quot;\&quot;id\&quot;&quot;</code> | Specifies the field which should be queried by default for .load |
| options.model | <code>Object</code> &#124; <code>Array.&lt;Object&gt;</code> |  | Either a registered sequelize model or if options.model is an Array it will be treated as the arguments to define a sequelize model |
| [options.sort] | <code>Object</code> &#124; <code>string</code> | <code>&quot;createdat DESC&quot;</code> | Specifies default sort logic for .query and .search queries |
| [options.limit] | <code>number</code> | <code>500</code> | Specifies a default limit to the total documents returned in a .query and .search queries |
| [options.skip] | <code>number</code> | <code>0</code> | Specifies a default amount of documents to skip in a .query and .search queries |
| [options.population] | <code>Object</code> &#124; <code>Array.&lt;Object&gt;</code> | <code>[]</code> | Optional population configuration for documents returned in .load and .search queries (see sequelize include for proper formatting) |
| [options.fields] | <code>Object</code> |  | Optional configuration for limiting fields that are returned in .load and .search queries |
| [options.pagelength] | <code>number</code> | <code>15</code> | Specifies max number of documents that should appear in each sub-set for pagination |
| [options.track_changes] | <code>Boolean</code> | <code>true</code> | Sets default track changes behavior for udpates |
| [options.xss_whitelist] | <code>Array.&lt;string&gt;</code> | <code>false</code> | Configuration for XSS whitelist package. If false XSS whitelisting will be ignored |

<a name="SQL_ADAPTER+sync"></a>

### sqL_ADAPTER.sync([options], [cb]) ⇒ <code>Object</code>
Sync defined sequelize models with SQL db

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for sequelize sync method |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+query"></a>

### sqL_ADAPTER.query([options], [cb]) ⇒ <code>Object</code>
Query method for adapter see _QUERY and _QUERY_WITH_PAGINATION for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for query |
| options.paginate | <code>Boolean</code> |  | When true query will return data in a paginated form |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+search"></a>

### sqL_ADAPTER.search([options], [cb]) ⇒ <code>Object</code>
Search method for adapter see _SEARCH for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for query |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+stream"></a>

### sqL_ADAPTER.stream([options], [cb]) ⇒ <code>Object</code>
Stream method for adapter see _STREAM for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for stream |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+load"></a>

### sqL_ADAPTER.load([options], [cb]) ⇒ <code>Object</code>
Load method for adapter see _LOAD for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for load |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+update"></a>

### sqL_ADAPTER.update([options], [cb]) ⇒ <code>Object</code>
Update method for adapter see _UPDATE, _UPDATED and _UPDATE_ALL for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for update |
| options.return_updated | <code>Boolean</code> |  | If true update method will return the updated document instead of an update status message |
| options.multi | <code>Boolean</code> |  | If true a multiple document update will be perfomed |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+create"></a>

### sqL_ADAPTER.create([options], [cb]) ⇒ <code>Object</code>
Create method for adapter see _CREATE for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for create |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+delete"></a>

### sqL_ADAPTER.delete([options], [cb]) ⇒ <code>Object</code>
Delete method for adapter see _DELETE and _DELETED for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for create |
| options.return_deleted | <code>Boolean</code> |  | If true delete method will return the deleted document |
| [cb] | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="SQL_ADAPTER+raw"></a>

### sqL_ADAPTER.raw(options, cb) ⇒ <code>Object</code>
Raw query method for adapter see _RAW for more details

**Kind**: instance method of <code>[SQL_ADAPTER](#SQL_ADAPTER)</code>  
**Returns**: <code>Object</code> - Returns a Promise when cb argument is not passed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for raw query |
| cb | <code>function</code> | <code>false</code> | Callback argument. When cb is not passed function returns a Promise |

<a name="CURSOR"></a>

## CURSOR : <code>Cursor</code>
A simple cursor-like implementation that combines generator and stream functionality. Cursor exposes all the normal stream methods such as pipe, unpipe, on, once etc as well as an initialize method that returns a generator and allows for documents to be iteratively resolved. Using both the generator based cursor interface and stream interface concurrently is not recommended as both utilize the TransformStream on data, on error and on finish events and as such will likely cause unpredictable behavior

**Kind**: global class  
**Extends:** <code>TranformStream</code>  

* [CURSOR](#CURSOR) : <code>Cursor</code>
    * [new CURSOR([options])](#new_CURSOR_new)
    * [._next()](#CURSOR+_next) ⇒ <code>Object</code>
    * [.initialize([onSuccess], [onError])](#CURSOR+initialize) ⇒ <code>function</code>

<a name="new_CURSOR_new"></a>

### new CURSOR([options])
Constructor for Cursor class


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Configurable options for cursor (see TransformStream documentation for more details) |
| options.objectMode | <code>Boolean</code> |  | Unlike a normal transform stream the cursor class is meant for documents and as such objectMode will always be true unless explicitly declared as false at initialization |

<a name="CURSOR+_next"></a>

### cursoR._next() ⇒ <code>Object</code>
Internally used _next method (this should never be accessed directly). Resumes the transform stream and resolves the next document before pausing the stream

**Kind**: instance method of <code>[CURSOR](#CURSOR)</code>  
**Returns**: <code>Object</code> - Returns a Promise which resolves with the next document written to the stream  
<a name="CURSOR+initialize"></a>

### cursoR.initialize([onSuccess], [onError]) ⇒ <code>function</code>
Initializes the cursor interface. Once initialized the generator will yield a single document with each next call. The behavior can be modified by passing an onSuccess function as the first argument with each next call. Once cursor is initialized the streams finish, data and error events will have registered listeners

**Kind**: instance method of <code>[CURSOR](#CURSOR)</code>  
**Returns**: <code>function</code> - Returns a generator that iteratively resolves the documents written to the stream  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [onSuccess] | <code>function</code> | <code>defaultSuccess</code> | A default function to be called on each successful .next call. This function can be temporarily overridden by passing a function in the .next call |
| [onError] | <code>function</code> | <code>defaultError</code> | A default function to be called when a .next call results in an rejection |

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
Convenience method for .find loki method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the loki query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The lowkie population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for query |

<a name="_STREAM"></a>

## _STREAM(options, cb)
Convenience method for returning a stream of loki data

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the loki query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The lowkie population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for stream |

<a name="_QUERY_WITH_PAGINATION"></a>

## _QUERY_WITH_PAGINATION(options, cb)
Convenience method for .find loki method with built in pagination of data

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the loki query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.pagelength] | <code>number</code> | <code>this.pagelength</code> | Defines the max length of each sub-set of data |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The lowkie population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for query |

<a name="_SEARCH"></a>

## _SEARCH(options, cb)
Convenience method for .find loki method with built in query builder functionality

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the loki query |
| [options.query] | <code>Object</code> &#124; <code>string</code> |  | The query that should be used for the database search. If this value is a string it will be treated as a delimited list of values to use in query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.pagelength] | <code>number</code> | <code>this.pagelength</code> | Defines the max length of each sub-set of data |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The lowkie population for query will default to the this.population value if not defined |
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
Convenience method for .findOne or .findById lowkie methods

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | The lowkie population for query will default to the this.population value if not defined |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.docid] | <code>string</code> | <code>&quot;\&quot;_id\&quot;&quot;</code> | A field that should be queried will default to "_id" |
| options.query | <code>Object</code> &#124; <code>string</code> &#124; <code>number</code> |  | If value is an object query will be set to the value otherwise a query will be built based on options.docid and any other value provided in options.query |
| cb | <code>function</code> |  | Callback function for load |

<a name="GENERATE_PATCH"></a>

## GENERATE_PATCH(data) ⇒ <code>function</code>
Creates a lowkie update operation

**Kind**: global function  
**Returns**: <code>function</code> - Returns a function that is used in loki update operation  

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
Convenience method for .update loki method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki update |
| options.isPatch | <code>Boolean</code> |  | If true the update will be treated as a patch instead of a full document update |
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updatedated document |
| options.id | <code>string</code> |  | The loki _id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_UPDATED"></a>

## _UPDATED(options, cb)
Convenience method for .findAndUpdate lowkie method (returns updated document instead of normal loki update status object)

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki update |
| options.isPatch | <code>Boolean</code> |  | If true the update will be treated as a patch instead of a full document update |
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updated document |
| options.id | <code>string</code> |  | The loki _id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_UPDATE_ALL"></a>

## _UPDATE_ALL(options, cb)
Convenience method for .update with the multi options set to true for multiple document updates

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki update with multi true |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| options.query | <code>Object</code> |  | Query that should be used in update |
| [options.updatequery] | <code>Object</code> |  | Alias for options.query if options.query is set this option is ignored |
| options.updateattributes | <code>Object</code> |  | A loki update formatted object |
| [options.updatedoc] | <code>Object</code> |  | Object specifying fields to update with new values this object will be formatted as a patch update. If options.updateattributes is set this option is ignored |
| cb | <code>function</code> |  | Callback function for update all |

<a name="_CREATE"></a>

## _CREATE(options, cb)
Convenience method for .create lowkie method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki create |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| [options.newdoc] | <code>Object</code> &#124; <code>Array.&lt;Object&gt;</code> | <code>options</code> | The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document |
| options.bulk_create | <code>Boolean</code> |  | If true and options.newdoc is an array each index will be treated as an individual document and be bulk inserted |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.xss_whitelist] | <code>Object</code> | <code>this.xss_whitelist</code> | XSS white-list configuration for xss npm module |
| cb | <code>function</code> |  | Callback function for create |

<a name="_DELETE"></a>

## _DELETE(options, cb)
Convenience method for .remove lowkie method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki delete |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| options.deleteid | <code>string</code> |  | The loki id of the document that should be removed |
| options.id | <code>string</code> |  | If options.deleteid is provided this value is ignored - alias for options.deleteid |
| cb | <code>function</code> |  | Callback function for delete |

<a name="_DELETED"></a>

## _DELETED(options, cb)
Convenience method for .remove lowkie method but returns the deleted document

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for loki delete |
| [options.model] | <code>Object</code> | <code>this.model</code> | The lowkie model for query will default to the this.model value if not defined |
| options.deleteid | <code>string</code> |  | The loki id of the document that should be removed |
| options.id | <code>string</code> |  | If options.deleteid is provided this value is ignored - alias for options.deleteid |
| cb | <code>function</code> |  | Callback function for delete |

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
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updated document |
| options.id | <code>string</code> |  | The mongo _id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_UPDATE_ALL"></a>

## _UPDATE_ALL(options, cb)
Convenience method for .update with the multi options set to true for multiple document updates

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo update with multi true |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| options.query | <code>Object</code> |  | Query that should be used in update |
| [options.updatequery] | <code>Object</code> |  | Alias for options.query if options.query is set this option is ignored |
| options.updateattributes | <code>Object</code> |  | A mongo update formatted object |
| [options.updatedoc] | <code>Object</code> |  | Object specifying fields to update with new values this object will be formatted as a patch update. If options.updateattributes is set this option is ignored |
| cb | <code>function</code> |  | Callback function for update all |

<a name="_CREATE"></a>

## _CREATE(options, cb)
Convenience method for .create mongoose method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo create |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| [options.newdoc] | <code>Object</code> &#124; <code>Array.&lt;Object&gt;</code> | <code>options</code> | The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document |
| options.bulk_create | <code>Boolean</code> |  | If true and options.newdoc is an array each index will be treated as an individual document and be bulk inserted |
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

<a name="GENERATE_SELECT"></a>

## GENERATE_SELECT(fields)
Takes a set of fields either as a comma delimited list or a mongoose style fields object and converts them into a sequelize compatible array

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Object</code> &#124; <code>string</code> | Fields that should be returned when running the query |

<a name="_QUERY"></a>

## _QUERY(options, cb)
Convenience method for .findAll sequelize method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the SQL query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration) |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for query |

<a name="_STREAM"></a>

## _STREAM(options, cb)
Convenience method for returning a stream of sql data. Since sequelize does not expose a cursor or stream method this is an implementation of a cursor on top of a normal SQL query

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the SQL query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration) |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for stream |

<a name="_QUERY_WITH_PAGINATION"></a>

## _QUERY_WITH_PAGINATION(options, cb)
Convenience method for .findAll SQL method with built in pagination of data

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the SQL query |
| [options.query] | <code>Object</code> | <code>{}</code> | The query that should be used for the database search |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.pagelength] | <code>number</code> | <code>this.pagelength</code> | Defines the max length of each sub-set of data |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration) |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.skip] | <code>number</code> |  | The number of documents to offset in query |
| cb | <code>function</code> |  | Callback function for query |

<a name="_SEARCH"></a>

## _SEARCH(options, cb)
Convenience method for .findAll SQL method with built in query builder functionality

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options for the SQL query |
| [options.query] | <code>Object</code> &#124; <code>string</code> |  | The query that should be used for the database search. If this value is a string it will be treated as a delimited list of values to use in query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.limit] | <code>number</code> | <code>this.limit</code> | Limits the total returned documents for query will default to the this.limit value if not defined |
| [options.pagelength] | <code>number</code> | <code>this.pagelength</code> | Defines the max length of each sub-set of data |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration) |
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
Convenience method for .findOne sequelize methods

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for mongo query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| [options.sort] | <code>string</code> | <code>&quot;this.sort&quot;</code> | Sorting criteria for query will default to the this.sort value if not defined |
| [options.population] | <code>Object</code> &#124; <code>string</code> | <code>this.population</code> | An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration) |
| [options.fields] | <code>Object</code> | <code>this.fields</code> | The fields that should be returned in query will default to the this.fields value if not defined |
| [options.docid] | <code>string</code> | <code>&quot;\&quot;id\&quot;&quot;</code> | A field that should be queried will default to "id" |
| options.query | <code>Object</code> &#124; <code>string</code> &#124; <code>number</code> |  | If value is an object query will be set to the value otherwise a query will be built based on options.docid and any other value provided in options.query |
| cb | <code>function</code> |  | Callback function for load |

<a name="_UPDATE"></a>

## _UPDATE(options, cb)
Convenience method for .update SQL method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for SQL update |
| options.isPatch | <code>Boolean</code> |  | If true the update will be treated as a patch instead of a full document update |
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updatedated document |
| options.id | <code>string</code> |  | The SQL id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_UPDATED"></a>

## _UPDATED(options, cb)
Convenience method for .update + .findOne sequelize method (returns updated document instead of normal number updated status)

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for SQL update |
| options.isPatch | <code>Boolean</code> |  | If true the update will be treated as a patch instead of a full document update |
| options.updatedoc | <code>Object</code> |  | Either specific fields to update in the case of a patch otherwise the entire updated document |
| options.id | <code>string</code> |  | The SQL id of the document that should be updated |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.track_changes] | <code>Boolean</code> |  | If false changes will not be tracked |
| [options.ensure_changes] | <code>Boolean</code> |  | If true changeset generation and saving is blocking and errors will cause entire operation to fail |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| cb | <code>function</code> |  | Callback function for update |

<a name="_UPDATE_ALL"></a>

## _UPDATE_ALL(options, cb)
Convenience method for .update for multiple document updates

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for SQL update with no limit |
| [options.model] | <code>Object</code> | <code>this.model</code> | The mongoose model for query will default to the this.model value if not defined |
| options.query | <code>Object</code> |  | Query that should be used in update |
| [options.updatequery] | <code>Object</code> |  | Alias for options.query if options.query is set this option is ignored |
| options.updateattributes | <code>Object</code> |  | A SQL update formatted object |
| [options.updatedoc] | <code>Object</code> |  | Object specifying fields to update with new values this object will be formatted as a patch update. If options.updateattributes is set this option is ignored |
| cb | <code>function</code> |  | Callback function for update all |

<a name="_CREATE"></a>

## _CREATE(options, cb)
Convenience method for .create sequelize method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for SQL create |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| [options.newdoc] | <code>Object</code> &#124; <code>Array.&lt;Object&gt;</code> | <code>options</code> | The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document. A bulk create will be done if newdoc is an array and bulk_create option is true |
| options.bulk_create | <code>Boolean</code> |  | If true and options.newdoc is an array each index will be treated as an individual document and be bulk inserted (WARNING: Due to limitations in MySQL and other SQL variants bulk creates can't assign auto-incremented ids please use accordingly) |
| [options.skip_xss] | <code>Boolean</code> |  | If true xss character escaping will be skipped and xss whitelist is ignored |
| [options.html_xss] | <code>Boolean</code> |  | If true xss npm module will be used for character escaping |
| [options.xss_whitelist] | <code>Object</code> | <code>this.xss_whitelist</code> | XSS white-list configuration for xss npm module |
| cb | <code>function</code> |  | Callback function for create |

<a name="_DELETE"></a>

## _DELETE(options, cb)
Convenience method for .destroy sequelize method

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for SQL delete |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| options.deleteid | <code>string</code> |  | The SQL id of the document that should be removed |
| options.id | <code>string</code> |  | If options.deleteid is provided this value is ignored - alias for options.deleteid |
| options.force | <code>Boolean</code> |  | If true document will always be fully deleted (if paranoid option is set on model this option will override) |
| cb | <code>function</code> |  | Callback function for delete |

<a name="_DELETED"></a>

## _DELETED(options, cb)
Convenience method for .destroy sequelize method but returns the deleted document

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for SQL delete |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| options.deleteid | <code>string</code> |  | The SQL id of the document that should be removed |
| options.id | <code>string</code> |  | If options.deleteid is provided this value is ignored - alias for options.deleteid |
| cb | <code>function</code> |  | Callback function for delete |

<a name="_RAW"></a>

## _RAW(options, cb)
Convenience method for .query sequelize method that allows for raw SQL queries

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Configurable options for raw SQL query |
| [options.model] | <code>Object</code> | <code>this.model</code> | The sequelize model for query will default to the this.model value if not defined |
| options.query | <code>string</code> |  | Raw query for SQL |
| options.raw_query | <code>string</code> |  | Alias for options.query. If options.query is set this option is ignored |
| options.raw | <code>string</code> |  | Alias for options.query. If options.query or options.raw_query is set this option is ignored |
| options.format_result | <code>Boolean</code> &#124; <code>Object</code> |  | If false result will not be formatted. If a sequelize query type object those rules will be used in formatting. If not false and not a format object the query type will be inferred from the raw query and formatting rules will be applied |
| cb | <code>function</code> |  | Callback function for raw query |

<a name="defaultSuccess"></a>

## defaultSuccess(data) ⇒ <code>\*</code>
A default on success function for each iteration of cursor

**Kind**: global function  
**Returns**: <code>\*</code> - Simply returns whatever data is passed as data arugment  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Generally a single document be pushed by stream but can be any data type or a Buffer if cursor is not instantiated in objectMode |

<a name="defaultError"></a>

## defaultError(e) ⇒ <code>Object</code>
A default on error function for each iteration of cursor

**Kind**: global function  
**Returns**: <code>Object</code> - Returns a rejected Promise  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Object</code> | An instance of Error |

