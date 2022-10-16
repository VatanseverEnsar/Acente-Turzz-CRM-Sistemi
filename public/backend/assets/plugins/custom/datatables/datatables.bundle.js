/*! DataTables 1.10.23
 * ©2008-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.23
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Protect against prototype pollution
					if (a[i] === '__proto__' || a[i] === 'constructor') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
		$(thead).children('tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.23";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		builder: "-source-",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));

/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


return DataTable;
}));

"use strict";
var defaults = {
	"language": {
		"paginate": {
			"first": '<i class="ki ki-double-arrow-back"></i>',
			"last": '<i class="ki ki-double-arrow-next"></i>',
			"next": '<i class="ki ki-arrow-next"></i>',
			"previous": '<i class="ki ki-arrow-back"></i>'
		}
	}
};

if (KTUtil.isRTL()) {
	defaults = {
		"language": {
			"paginate": {
				"first": '<i class="ki ki-double-arrow-next"></i>',
				"last": '<i class="ki ki-double-arrow-back"></i>',
				"next": '<i class="ki ki-arrow-back"></i>',
				"previous": '<i class="ki ki-arrow-next"></i>'
			}
		}
	}
}

$.extend(true, $.fn.dataTable.defaults, defaults);

// fix dropdown overflow inside datatable
KTApp.initAbsoluteDropdown('.dataTables_wrapper');

/*!
 AutoFill 2.3.5
 ©2008-2020 SpryMedia Ltd - datatables.net/license
*/
(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(g){return e(g,window,document)}):"object"===typeof exports?module.exports=function(g,i){g||(g=window);if(!i||!i.fn.dataTable)i=require("datatables.net")(g,i).$;return e(i,g,g.document)}:e(jQuery,window,document)})(function(e,g,i,r){var l=e.fn.dataTable,t=0,k=function(b,c){if(!l.versionCheck||!l.versionCheck("1.10.8"))throw"Warning: AutoFill requires DataTables 1.10.8 or greater";this.c=e.extend(!0,{},l.defaults.autoFill,
k.defaults,c);this.s={dt:new l.Api(b),namespace:".autoFill"+t++,scroll:{},scrollInterval:null,handle:{height:0,width:0},enabled:!1};this.dom={handle:e('<div class="dt-autofill-handle"/>'),select:{top:e('<div class="dt-autofill-select top"/>'),right:e('<div class="dt-autofill-select right"/>'),bottom:e('<div class="dt-autofill-select bottom"/>'),left:e('<div class="dt-autofill-select left"/>')},background:e('<div class="dt-autofill-background"/>'),list:e('<div class="dt-autofill-list">'+this.s.dt.i18n("autoFill.info",
"")+"<ul/></div>"),dtScroll:null,offsetParent:null};this._constructor()};e.extend(k.prototype,{enabled:function(){return this.s.enabled},enable:function(b){var c=this;if(!1===b)return this.disable();this.s.enabled=!0;this._focusListener();this.dom.handle.on("mousedown",function(a){c._mousedown(a);return!1});return this},disable:function(){this.s.enabled=!1;this._focusListenerRemove();return this},_constructor:function(){var b=this,c=this.s.dt,a=e("div.dataTables_scrollBody",this.s.dt.table().container());
c.settings()[0].autoFill=this;a.length&&(this.dom.dtScroll=a,"static"===a.css("position")&&a.css("position","relative"));!1!==this.c.enable&&this.enable();c.on("destroy.autoFill",function(){b._focusListenerRemove()})},_attach:function(b){var c=this.s.dt,a=c.cell(b).index(),d=this.dom.handle,f=this.s.handle;if(!a||-1===c.columns(this.c.columns).indexes().indexOf(a.column))this._detach();else{this.dom.offsetParent||(this.dom.offsetParent=e(c.table().node()).offsetParent());if(!f.height||!f.width)d.appendTo("body"),
f.height=d.outerHeight(),f.width=d.outerWidth();c=this._getPosition(b,this.dom.offsetParent);this.dom.attachedTo=b;d.css({top:c.top+b.offsetHeight-f.height,left:c.left+b.offsetWidth-f.width}).appendTo(this.dom.offsetParent)}},_actionSelector:function(b){var c=this,a=this.s.dt,d=k.actions,f=[];e.each(d,function(c,d){d.available(a,b)&&f.push(c)});if(1===f.length&&!1===this.c.alwaysAsk){var j=d[f[0]].execute(a,b);this._update(j,b)}else if(1<f.length){var h=this.dom.list.children("ul").empty();f.push("cancel");
e.each(f,function(f,j){h.append(e("<li/>").append('<div class="dt-autofill-question">'+d[j].option(a,b)+"<div>").append(e('<div class="dt-autofill-button">').append(e('<button class="'+k.classes.btn+'">'+a.i18n("autoFill.button","&gt;")+"</button>").on("click",function(){var f=d[j].execute(a,b,e(this).closest("li"));c._update(f,b);c.dom.background.remove();c.dom.list.remove()}))))});this.dom.background.appendTo("body");this.dom.list.appendTo("body");this.dom.list.css("margin-top",-1*(this.dom.list.outerHeight()/
2))}},_detach:function(){this.dom.attachedTo=null;this.dom.handle.detach()},_drawSelection:function(b){var c=this.s.dt,a=this.s.start,d=e(this.dom.start),f={row:this.c.vertical?c.rows({page:"current"}).nodes().indexOf(b.parentNode):a.row,column:this.c.horizontal?e(b).index():a.column},b=c.column.index("toData",f.column),j=c.row(":eq("+f.row+")",{page:"current"}),j=e(c.cell(j.index(),b).node());if(c.cell(j).any()&&-1!==c.columns(this.c.columns).indexes().indexOf(b)){this.s.end=f;var h,c=a.row<f.row?
d:j;h=a.row<f.row?j:d;b=a.column<f.column?d:j;d=a.column<f.column?j:d;c=this._getPosition(c.get(0)).top;b=this._getPosition(b.get(0)).left;a=this._getPosition(h.get(0)).top+h.outerHeight()-c;d=this._getPosition(d.get(0)).left+d.outerWidth()-b;f=this.dom.select;f.top.css({top:c,left:b,width:d});f.left.css({top:c,left:b,height:a});f.bottom.css({top:c+a,left:b,width:d});f.right.css({top:c,left:b+d,height:a})}},_editor:function(b){var c=this.s.dt,a=this.c.editor;if(a){for(var d={},f=[],e=a.fields(),h=
0,i=b.length;h<i;h++)for(var p=0,k=b[h].length;p<k;p++){var n=b[h][p],g=c.settings()[0].aoColumns[n.index.column],o=g.editField;if(o===r)for(var g=g.mData,q=0,l=e.length;q<l;q++){var s=a.field(e[q]);if(s.dataSrc()===g){o=s.name();break}}if(!o)throw"Could not automatically determine field data. Please see https://datatables.net/tn/11";d[o]||(d[o]={});g=c.row(n.index.row).id();d[o][g]=n.set;f.push(n.index)}a.bubble(f,!1).multiSet(d).submit()}},_emitEvent:function(b,c){this.s.dt.iterator("table",function(a){e(a.nTable).triggerHandler(b+
".dt",c)})},_focusListener:function(){var b=this,c=this.s.dt,a=this.s.namespace,d=null!==this.c.focus?this.c.focus:c.init().keys||c.settings()[0].keytable?"focus":"hover";if("focus"===d)c.on("key-focus.autoFill",function(a,c,d){b._attach(d.node())}).on("key-blur.autoFill",function(){b._detach()});else if("click"===d)e(c.table().body()).on("click"+a,"td, th",function(){b._attach(this)}),e(i.body).on("click"+a,function(a){e(a.target).parents().filter(c.table().body()).length||b._detach()});else e(c.table().body()).on("mouseenter"+
a,"td, th",function(){b._attach(this)}).on("mouseleave"+a,function(a){e(a.relatedTarget).hasClass("dt-autofill-handle")||b._detach()})},_focusListenerRemove:function(){var b=this.s.dt;b.off(".autoFill");e(b.table().body()).off(this.s.namespace);e(i.body).off(this.s.namespace)},_getPosition:function(b,c){var a=b,d,f=0,j=0;c||(c=e(e(this.s.dt.table().node())[0].offsetParent));do{var h=a.offsetTop,i=a.offsetLeft;d=e(a.offsetParent);f+=h+1*parseInt(d.css("border-top-width"));j+=i+1*parseInt(d.css("border-left-width"));
if("body"===a.nodeName.toLowerCase())break;a=d.get(0)}while(d.get(0)!==c.get(0));return{top:f,left:j}},_mousedown:function(b){var c=this,a=this.s.dt;this.dom.start=this.dom.attachedTo;this.s.start={row:a.rows({page:"current"}).nodes().indexOf(e(this.dom.start).parent()[0]),column:e(this.dom.start).index()};e(i.body).on("mousemove.autoFill",function(a){c._mousemove(a)}).on("mouseup.autoFill",function(a){c._mouseup(a)});var d=this.dom.select,a=e(a.table().node()).offsetParent();d.top.appendTo(a);d.left.appendTo(a);
d.right.appendTo(a);d.bottom.appendTo(a);this._drawSelection(this.dom.start,b);this.dom.handle.css("display","none");b=this.dom.dtScroll;this.s.scroll={windowHeight:e(g).height(),windowWidth:e(g).width(),dtTop:b?b.offset().top:null,dtLeft:b?b.offset().left:null,dtHeight:b?b.outerHeight():null,dtWidth:b?b.outerWidth():null}},_mousemove:function(b){var c=b.target.nodeName.toLowerCase();"td"!==c&&"th"!==c||(this._drawSelection(b.target,b),this._shiftScroll(b))},_mouseup:function(b){e(i.body).off(".autoFill");
var c=this,a=this.s.dt,d=this.dom.select;d.top.remove();d.left.remove();d.right.remove();d.bottom.remove();this.dom.handle.css("display","block");var d=this.s.start,f=this.s.end;if(!(d.row===f.row&&d.column===f.column)){var j=a.cell(":eq("+d.row+")",d.column+":visible",{page:"current"});if(e("div.DTE",j.node()).length){var h=a.editor();h.on("submitSuccess.dtaf close.dtaf",function(){h.off(".dtaf");setTimeout(function(){c._mouseup(b)},100)}).on("submitComplete.dtaf preSubmitCancelled.dtaf close.dtaf",
function(){h.off(".dtaf")});h.submit()}else{for(var g=this._range(d.row,f.row),d=this._range(d.column,f.column),f=[],k=a.settings()[0],l=k.aoColumns,n=a.columns(this.c.columns).indexes(),m=0;m<g.length;m++)f.push(e.map(d,function(b){var c=a.row(":eq("+g[m]+")",{page:"current"}),b=a.cell(c.index(),b+":visible"),c=b.data(),d=b.index(),f=l[d.column].editField;f!==r&&(c=k.oApi._fnGetObjectDataFn(f)(a.row(d.row).data()));if(-1!==n.indexOf(d.column))return{cell:b,data:c,label:b.data(),index:d}}));this._actionSelector(f);
clearInterval(this.s.scrollInterval);this.s.scrollInterval=null}}},_range:function(b,c){var a=[],d;if(b<=c)for(d=b;d<=c;d++)a.push(d);else for(d=b;d>=c;d--)a.push(d);return a},_shiftScroll:function(b){var c=this,a=this.s.scroll,d=!1,f=b.pageY-i.body.scrollTop,e=b.pageX-i.body.scrollLeft,h,g,k,l;65>f?h=-5:f>a.windowHeight-65&&(h=5);65>e?g=-5:e>a.windowWidth-65&&(g=5);null!==a.dtTop&&b.pageY<a.dtTop+65?k=-5:null!==a.dtTop&&b.pageY>a.dtTop+a.dtHeight-65&&(k=5);null!==a.dtLeft&&b.pageX<a.dtLeft+65?l=
-5:null!==a.dtLeft&&b.pageX>a.dtLeft+a.dtWidth-65&&(l=5);h||g||k||l?(a.windowVert=h,a.windowHoriz=g,a.dtVert=k,a.dtHoriz=l,d=!0):this.s.scrollInterval&&(clearInterval(this.s.scrollInterval),this.s.scrollInterval=null);!this.s.scrollInterval&&d&&(this.s.scrollInterval=setInterval(function(){if(a.windowVert)i.body.scrollTop=i.body.scrollTop+a.windowVert;if(a.windowHoriz)i.body.scrollLeft=i.body.scrollLeft+a.windowHoriz;if(a.dtVert||a.dtHoriz){var b=c.dom.dtScroll[0];if(a.dtVert)b.scrollTop=b.scrollTop+
a.dtVert;if(a.dtHoriz)b.scrollLeft=b.scrollLeft+a.dtHoriz}},20))},_update:function(b,c){if(!1!==b){var a=this.s.dt,d,f=a.columns(this.c.columns).indexes();this._emitEvent("preAutoFill",[a,c]);this._editor(c);if(null!==this.c.update?this.c.update:!this.c.editor){for(var e=0,h=c.length;e<h;e++)for(var g=0,i=c[e].length;g<i;g++)d=c[e][g],-1!==f.indexOf(d.index.column)&&d.cell.data(d.set);a.draw(!1)}this._emitEvent("autoFill",[a,c])}}});k.actions={increment:{available:function(b,c){var a=c[0][0].label;
return!isNaN(a-parseFloat(a))},option:function(b){return b.i18n("autoFill.increment",'Increment / decrement each cell by: <input type="number" value="1">')},execute:function(b,c,a){for(var b=1*c[0][0].data,a=1*e("input",a).val(),d=0,f=c.length;d<f;d++)for(var j=0,g=c[d].length;j<g;j++)c[d][j].set=b,b+=a}},fill:{available:function(){return!0},option:function(b,c){return b.i18n("autoFill.fill","Fill all cells with <i>"+c[0][0].label+"</i>")},execute:function(b,c){for(var a=c[0][0].data,d=0,f=c.length;d<
f;d++)for(var e=0,g=c[d].length;e<g;e++)c[d][e].set=a}},fillHorizontal:{available:function(b,c){return 1<c.length&&1<c[0].length},option:function(b){return b.i18n("autoFill.fillHorizontal","Fill cells horizontally")},execute:function(b,c){for(var a=0,d=c.length;a<d;a++)for(var f=0,e=c[a].length;f<e;f++)c[a][f].set=c[a][0].data}},fillVertical:{available:function(b,c){return 1<c.length},option:function(b){return b.i18n("autoFill.fillVertical","Fill cells vertically")},execute:function(b,c){for(var a=
0,d=c.length;a<d;a++)for(var e=0,g=c[a].length;e<g;e++)c[a][e].set=c[0][e].data}},cancel:{available:function(){return!1},option:function(b){return b.i18n("autoFill.cancel","Cancel")},execute:function(){return!1}}};k.version="2.3.5";k.defaults={alwaysAsk:!1,focus:null,columns:"",enable:!0,update:null,editor:null,vertical:!0,horizontal:!0};k.classes={btn:"btn"};var m=e.fn.dataTable.Api;m.register("autoFill()",function(){return this});m.register("autoFill().enabled()",function(){var b=this.context[0];
return b.autoFill?b.autoFill.enabled():!1});m.register("autoFill().enable()",function(b){return this.iterator("table",function(c){c.autoFill&&c.autoFill.enable(b)})});m.register("autoFill().disable()",function(){return this.iterator("table",function(b){b.autoFill&&b.autoFill.disable()})});e(i).on("preInit.dt.autofill",function(b,c){if("dt"===b.namespace){var a=c.oInit.autoFill,d=l.defaults.autoFill;if(a||d)d=e.extend({},a,d),!1!==a&&new k(c,d)}});l.AutoFill=k;return l.AutoFill=k});

/*!
 Bootstrap integration for DataTables' AutoFill
 ©2015 SpryMedia Ltd - datatables.net/license
*/
(function(a){"function"===typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-autofill"],function(b){return a(b,window,document)}):"object"===typeof exports?module.exports=function(b,c){b||(b=window);if(!c||!c.fn.dataTable)c=require("datatables.net-bs4")(b,c).$;c.fn.dataTable.AutoFill||require("datatables.net-autofill")(b,c);return a(c,b,b.document)}:a(jQuery,window,document)})(function(a){a=a.fn.dataTable;a.AutoFill.classes.btn="btn btn-primary";return a});

/*!

JSZip v3.5.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/

!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=t()}}(function(){return function s(a,o,h){function u(r,t){if(!o[r]){if(!a[r]){var e="function"==typeof require&&require;if(!t&&e)return e(r,!0);if(l)return l(r,!0);var i=new Error("Cannot find module '"+r+"'");throw i.code="MODULE_NOT_FOUND",i}var n=o[r]={exports:{}};a[r][0].call(n.exports,function(t){var e=a[r][1][t];return u(e||t)},n,n.exports,s,a,o,h)}return o[r].exports}for(var l="function"==typeof require&&require,t=0;t<h.length;t++)u(h[t]);return u}({1:[function(t,e,r){"use strict";var c=t("./utils"),d=t("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(t){for(var e,r,i,n,s,a,o,h=[],u=0,l=t.length,f=l,d="string"!==c.getTypeOf(t);u<t.length;)f=l-u,i=d?(e=t[u++],r=u<l?t[u++]:0,u<l?t[u++]:0):(e=t.charCodeAt(u++),r=u<l?t.charCodeAt(u++):0,u<l?t.charCodeAt(u++):0),n=e>>2,s=(3&e)<<4|r>>4,a=1<f?(15&r)<<2|i>>6:64,o=2<f?63&i:64,h.push(p.charAt(n)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(t){var e,r,i,n,s,a,o=0,h=0,u="data:";if(t.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(t.charAt(t.length-1)===p.charAt(64)&&f--,t.charAt(t.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=d.uint8array?new Uint8Array(0|f):new Array(0|f);o<t.length;)e=p.indexOf(t.charAt(o++))<<2|(n=p.indexOf(t.charAt(o++)))>>4,r=(15&n)<<4|(s=p.indexOf(t.charAt(o++)))>>2,i=(3&s)<<6|(a=p.indexOf(t.charAt(o++))),l[h++]=e,64!==s&&(l[h++]=r),64!==a&&(l[h++]=i);return l}},{"./support":30,"./utils":32}],2:[function(t,e,r){"use strict";var i=t("./external"),n=t("./stream/DataWorker"),s=t("./stream/DataLengthProbe"),a=t("./stream/Crc32Probe");s=t("./stream/DataLengthProbe");function o(t,e,r,i,n){this.compressedSize=t,this.uncompressedSize=e,this.crc32=r,this.compression=i,this.compressedContent=n}o.prototype={getContentWorker:function(){var t=new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),e=this;return t.on("end",function(){if(this.streamInfo.data_length!==e.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),t},getCompressedWorker:function(){return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(t,e,r){return t.pipe(new a).pipe(new s("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression",e)},e.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(t,e,r){"use strict";var i=t("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(t){return new i("STORE compression")},uncompressWorker:function(){return new i("STORE decompression")}},r.DEFLATE=t("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(t,e,r){"use strict";var i=t("./utils");var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e){return void 0!==t&&t.length?"string"!==i.getTypeOf(t)?function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}(0|e,t,t.length,0):function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e.charCodeAt(a))];return-1^t}(0|e,t,t.length,0):0}},{"./utils":32}],5:[function(t,e,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(t,e,r){"use strict";var i=null;i="undefined"!=typeof Promise?Promise:t("lie"),e.exports={Promise:i}},{lie:37}],7:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,n=t("pako"),s=t("./utils"),a=t("./stream/GenericWorker"),o=i?"uint8array":"array";function h(t,e){a.call(this,"FlateWorker/"+t),this._pako=null,this._pakoAction=t,this._pakoOptions=e,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(t){this.meta=t.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,t.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new n[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},r.compressWorker=function(t){return new h("Deflate",t)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(t,e,r){"use strict";function A(t,e){var r,i="";for(r=0;r<e;r++)i+=String.fromCharCode(255&t),t>>>=8;return i}function i(t,e,r,i,n,s){var a,o,h=t.file,u=t.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),d=I.transformTo("string",O.utf8encode(h.name)),c=h.comment,p=I.transformTo("string",s(c)),m=I.transformTo("string",O.utf8encode(c)),_=d.length!==h.name.length,g=m.length!==c.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};e&&!r||(x.crc32=t.crc32,x.compressedSize=t.compressedSize,x.uncompressedSize=t.uncompressedSize);var S=0;e&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===n?(C=798,z|=function(t,e){var r=t;return t||(r=e?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(t){return 63&(t||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+d,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(i,4)+f+b+p}}var I=t("../utils"),n=t("../stream/GenericWorker"),O=t("../utf8"),B=t("../crc32"),R=t("../signature");function s(t,e,r,i){n.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=e,this.zipPlatform=r,this.encodeFileName=i,this.streamFiles=t,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,n),s.prototype.push=function(t){var e=t.meta.percent||0,r=this.entriesCount,i=this._sources.length;this.accumulate?this.contentBuffer.push(t):(this.bytesWritten+=t.data.length,n.prototype.push.call(this,{data:t.data,meta:{currentFile:this.currentFile,percent:r?(e+100*(r-i-1))/r:100}}))},s.prototype.openedSource=function(t){this.currentSourceOffset=this.bytesWritten,this.currentFile=t.file.name;var e=this.streamFiles&&!t.file.dir;if(e){var r=i(t,e,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(t){this.accumulate=!1;var e=this.streamFiles&&!t.file.dir,r=i(t,e,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),e)this.push({data:function(t){return R.DATA_DESCRIPTOR+A(t.crc32,4)+A(t.compressedSize,4)+A(t.uncompressedSize,4)}(t),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var t=this.bytesWritten,e=0;e<this.dirRecords.length;e++)this.push({data:this.dirRecords[e],meta:{percent:100}});var r=this.bytesWritten-t,i=function(t,e,r,i,n){var s=I.transformTo("string",n(i));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(t,2)+A(t,2)+A(e,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,t,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(t){this._sources.push(t);var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.closedSource(e.previous.streamInfo),e._sources.length?e.prepareNextSource():e.end()}),t.on("error",function(t){e.error(t)}),this},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(t){var e=this._sources;if(!n.prototype.error.call(this,t))return!1;for(var r=0;r<e.length;r++)try{e[r].error(t)}catch(t){}return!0},s.prototype.lock=function(){n.prototype.lock.call(this);for(var t=this._sources,e=0;e<t.length;e++)t[e].lock()},e.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(t,e,r){"use strict";var u=t("../compressions"),i=t("./ZipFileWorker");r.generateWorker=function(t,a,e){var o=new i(a.streamFiles,e,a.platform,a.encodeFileName),h=0;try{t.forEach(function(t,e){h++;var r=function(t,e){var r=t||e,i=u[r];if(!i)throw new Error(r+" is not a valid compression method !");return i}(e.options.compression,a.compression),i=e.options.compressionOptions||a.compressionOptions||{},n=e.dir,s=e.date;e._compressWorker(r,i).withStreamInfo("file",{name:t,dir:n,date:s,comment:e.comment||"",unixPermissions:e.unixPermissions,dosPermissions:e.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(t){o.error(t)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(t,e,r){"use strict";function i(){if(!(this instanceof i))return new i;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var t=new i;for(var e in this)"function"!=typeof this[e]&&(t[e]=this[e]);return t}}(i.prototype=t("./object")).loadAsync=t("./load"),i.support=t("./support"),i.defaults=t("./defaults"),i.version="3.5.0",i.loadAsync=function(t,e){return(new i).loadAsync(t,e)},i.external=t("./external"),e.exports=i},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(t,e,r){"use strict";var i=t("./utils"),n=t("./external"),o=t("./utf8"),h=(i=t("./utils"),t("./zipEntries")),s=t("./stream/Crc32Probe"),u=t("./nodejsUtils");function l(i){return new n.Promise(function(t,e){var r=i.decompressed.getContentWorker().pipe(new s);r.on("error",function(t){e(t)}).on("end",function(){r.streamInfo.crc32!==i.decompressed.crc32?e(new Error("Corrupted zip : CRC32 mismatch")):t()}).resume()})}e.exports=function(t,s){var a=this;return s=i.extend(s||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),u.isNode&&u.isStream(t)?n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):i.prepareContent("the loaded zip file",t,!0,s.optimizedBinaryString,s.base64).then(function(t){var e=new h(s);return e.load(t),e}).then(function(t){var e=[n.Promise.resolve(t)],r=t.files;if(s.checkCRC32)for(var i=0;i<r.length;i++)e.push(l(r[i]));return n.Promise.all(e)}).then(function(t){for(var e=t.shift(),r=e.files,i=0;i<r.length;i++){var n=r[i];a.file(n.fileNameStr,n.decompressed,{binary:!0,optimizedBinaryString:!0,date:n.date,dir:n.dir,comment:n.fileCommentStr.length?n.fileCommentStr:null,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions,createFolders:s.createFolders})}return e.zipComment.length&&(a.comment=e.zipComment),a})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../stream/GenericWorker");function s(t,e){n.call(this,"Nodejs stream input adapter for "+t),this._upstreamEnded=!1,this._bindStream(e)}i.inherits(s,n),s.prototype._bindStream=function(t){var e=this;(this._stream=t).pause(),t.on("data",function(t){e.push({data:t,meta:{percent:0}})}).on("error",function(t){e.isPaused?this.generatedError=t:e.error(t)}).on("end",function(){e.isPaused?e._upstreamEnded=!0:e.end()})},s.prototype.pause=function(){return!!n.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(t,e,r){"use strict";var n=t("readable-stream").Readable;function i(t,e,r){n.call(this,e),this._helper=t;var i=this;t.on("data",function(t,e){i.push(t)||i._helper.pause(),r&&r(e)}).on("error",function(t){i.emit("error",t)}).on("end",function(){i.push(null)})}t("../utils").inherits(i,n),i.prototype._read=function(){this._helper.resume()},e.exports=i},{"../utils":32,"readable-stream":16}],14:[function(t,e,r){"use strict";e.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(t,e){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(t,e);if("number"==typeof t)throw new Error('The "data" argument must not be a number');return new Buffer(t,e)},allocBuffer:function(t){if(Buffer.alloc)return Buffer.alloc(t);var e=new Buffer(t);return e.fill(0),e},isBuffer:function(t){return Buffer.isBuffer(t)},isStream:function(t){return t&&"function"==typeof t.on&&"function"==typeof t.pause&&"function"==typeof t.resume}}},{}],15:[function(t,e,r){"use strict";function s(t,e,r){var i,n=u.getTypeOf(e),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(t=g(t)),s.createFolders&&(i=_(t))&&b.call(this,i,!0);var a="string"===n&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(e instanceof d&&0===e.uncompressedSize||s.dir||!e||0===e.length)&&(s.base64=!1,s.binary=!0,e="",s.compression="STORE",n="string");var o=null;o=e instanceof d||e instanceof l?e:p.isNode&&p.isStream(e)?new m(t,e):u.prepareContent(t,e,s.binary,s.optimizedBinaryString,s.base64);var h=new c(t,o,s);this.files[t]=h}var n=t("./utf8"),u=t("./utils"),l=t("./stream/GenericWorker"),a=t("./stream/StreamHelper"),f=t("./defaults"),d=t("./compressedObject"),c=t("./zipObject"),o=t("./generate"),p=t("./nodejsUtils"),m=t("./nodejs/NodejsStreamInputAdapter"),_=function(t){"/"===t.slice(-1)&&(t=t.substring(0,t.length-1));var e=t.lastIndexOf("/");return 0<e?t.substring(0,e):""},g=function(t){return"/"!==t.slice(-1)&&(t+="/"),t},b=function(t,e){return e=void 0!==e?e:f.createFolders,t=g(t),this.files[t]||s.call(this,t,null,{dir:!0,createFolders:e}),this.files[t]};function h(t){return"[object RegExp]"===Object.prototype.toString.call(t)}var i={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(t){var e,r,i;for(e in this.files)this.files.hasOwnProperty(e)&&(i=this.files[e],(r=e.slice(this.root.length,e.length))&&e.slice(0,this.root.length)===this.root&&t(r,i))},filter:function(r){var i=[];return this.forEach(function(t,e){r(t,e)&&i.push(e)}),i},file:function(t,e,r){if(1!==arguments.length)return t=this.root+t,s.call(this,t,e,r),this;if(h(t)){var i=t;return this.filter(function(t,e){return!e.dir&&i.test(t)})}var n=this.files[this.root+t];return n&&!n.dir?n:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(t,e){return e.dir&&r.test(t)});var t=this.root+r,e=b.call(this,t),i=this.clone();return i.root=e.name,i},remove:function(r){r=this.root+r;var t=this.files[r];if(t||("/"!==r.slice(-1)&&(r+="/"),t=this.files[r]),t&&!t.dir)delete this.files[r];else for(var e=this.filter(function(t,e){return e.name.slice(0,r.length)===r}),i=0;i<e.length;i++)delete this.files[e[i].name];return this},generate:function(t){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(t){var e,r={};try{if((r=u.extend(t||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:n.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var i=r.comment||this.comment||"";e=o.generateWorker(this,r,i)}catch(t){(e=new l("error")).error(t)}return new a(e,r.type||"string",r.mimeType)},generateAsync:function(t,e){return this.generateInternalStream(t).accumulate(e)},generateNodeStream:function(t,e){return(t=t||{}).type||(t.type="nodebuffer"),this.generateInternalStream(t).toNodejsStream(e)}};e.exports=i},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(t,e,r){e.exports=t("stream")},{stream:void 0}],17:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data[this.zero+t]},n.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===e&&this.data[s+1]===r&&this.data[s+2]===i&&this.data[s+3]===n)return s-this.zero;return-1},n.prototype.readAndCheckSignature=function(t){var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.readData(4);return e===s[0]&&r===s[1]&&i===s[2]&&n===s[3]},n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return[];var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],18:[function(t,e,r){"use strict";var i=t("../utils");function n(t){this.data=t,this.length=t.length,this.index=0,this.zero=0}n.prototype={checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<this.zero+t||t<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(t){},readInt:function(t){var e,r=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)r=(r<<8)+this.byteAt(e);return this.index+=t,r},readString:function(t){return i.transformTo("string",this.readData(t))},readData:function(t){},lastIndexOfSignature:function(t){},readAndCheckSignature:function(t){},readDate:function(){var t=this.readInt(4);return new Date(Date.UTC(1980+(t>>25&127),(t>>21&15)-1,t>>16&31,t>>11&31,t>>5&63,(31&t)<<1))}},e.exports=n},{"../utils":32}],19:[function(t,e,r){"use strict";var i=t("./Uint8ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data.charCodeAt(this.zero+t)},n.prototype.lastIndexOfSignature=function(t){return this.data.lastIndexOf(t)-this.zero},n.prototype.readAndCheckSignature=function(t){return t===this.readData(4)},n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],21:[function(t,e,r){"use strict";var i=t("./ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return new Uint8Array(0);var e=this.data.subarray(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./ArrayReader":17}],22:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../support"),s=t("./ArrayReader"),a=t("./StringReader"),o=t("./NodeBufferReader"),h=t("./Uint8ArrayReader");e.exports=function(t){var e=i.getTypeOf(t);return i.checkSupport(e),"string"!==e||n.uint8array?"nodebuffer"===e?new o(t):n.uint8array?new h(i.transformTo("uint8array",t)):new s(i.transformTo("array",t)):new a(t)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(t,e,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../utils");function s(t){i.call(this,"ConvertWorker to "+t),this.destType=t}n.inherits(s,i),s.prototype.processChunk=function(t){this.push({data:n.transformTo(this.destType,t.data),meta:t.meta})},e.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../crc32");function s(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t("../utils").inherits(s,i),s.prototype.processChunk=function(t){this.streamInfo.crc32=n(t.data,this.streamInfo.crc32||0),this.push(t)},e.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataLengthProbe for "+t),this.propName=t,this.withStreamInfo(t,0)}i.inherits(s,n),s.prototype.processChunk=function(t){if(t){var e=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=e+t.data.length}n.prototype.processChunk.call(this,t)},e.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataWorker");var e=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,t.then(function(t){e.dataIsReady=!0,e.data=t,e.max=t&&t.length||0,e.type=i.getTypeOf(t),e.isPaused||e._tickAndRepeat()},function(t){e.error(t)})}i.inherits(s,n),s.prototype.cleanUp=function(){n.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,i.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(i.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var t=null,e=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":t=this.data.substring(this.index,e);break;case"uint8array":t=this.data.subarray(this.index,e);break;case"array":case"nodebuffer":t=this.data.slice(this.index,e)}return this.index=e,this.push({data:t,meta:{percent:this.max?this.index/this.max*100:0}})},e.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(t,e,r){"use strict";function i(t){this.name=t||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}i.prototype={push:function(t){this.emit("data",t)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(t){this.emit("error",t)}return!0},error:function(t){return!this.isFinished&&(this.isPaused?this.generatedError=t:(this.isFinished=!0,this.emit("error",t),this.previous&&this.previous.error(t),this.cleanUp()),!0)},on:function(t,e){return this._listeners[t].push(e),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(t,e){if(this._listeners[t])for(var r=0;r<this._listeners[t].length;r++)this._listeners[t][r].call(this,e)},pipe:function(t){return t.registerPrevious(this)},registerPrevious:function(t){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=t.streamInfo,this.mergeStreamInfo(),this.previous=t;var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.end()}),t.on("error",function(t){e.error(t)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var t=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),t=!0),this.previous&&this.previous.resume(),!t},flush:function(){},processChunk:function(t){this.push(t)},withStreamInfo:function(t,e){return this.extraStreamInfo[t]=e,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var t in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(t)&&(this.streamInfo[t]=this.extraStreamInfo[t])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var t="Worker "+this.name;return this.previous?this.previous+" -> "+t:t}},e.exports=i},{}],29:[function(t,e,r){"use strict";var h=t("../utils"),n=t("./ConvertWorker"),s=t("./GenericWorker"),u=t("../base64"),i=t("../support"),a=t("../external"),o=null;if(i.nodestream)try{o=t("../nodejs/NodejsStreamOutputAdapter")}catch(t){}function l(t,o){return new a.Promise(function(e,r){var i=[],n=t._internalType,s=t._outputType,a=t._mimeType;t.on("data",function(t,e){i.push(t),o&&o(e)}).on("error",function(t){i=[],r(t)}).on("end",function(){try{var t=function(t,e,r){switch(t){case"blob":return h.newBlob(h.transformTo("arraybuffer",e),r);case"base64":return u.encode(e);default:return h.transformTo(t,e)}}(s,function(t,e){var r,i=0,n=null,s=0;for(r=0;r<e.length;r++)s+=e[r].length;switch(t){case"string":return e.join("");case"array":return Array.prototype.concat.apply([],e);case"uint8array":for(n=new Uint8Array(s),r=0;r<e.length;r++)n.set(e[r],i),i+=e[r].length;return n;case"nodebuffer":return Buffer.concat(e);default:throw new Error("concat : unsupported type '"+t+"'")}}(n,i),a);e(t)}catch(t){r(t)}i=[]}).resume()})}function f(t,e,r){var i=e;switch(e){case"blob":case"arraybuffer":i="uint8array";break;case"base64":i="string"}try{this._internalType=i,this._outputType=e,this._mimeType=r,h.checkSupport(i),this._worker=t.pipe(new n(i)),t.lock()}catch(t){this._worker=new s("error"),this._worker.error(t)}}f.prototype={accumulate:function(t){return l(this,t)},on:function(t,e){var r=this;return"data"===t?this._worker.on(t,function(t){e.call(r,t.data,t.meta)}):this._worker.on(t,function(){h.delay(e,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(t){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},t)}},e.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(t,e,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var i=new ArrayBuffer(0);try{r.blob=0===new Blob([i],{type:"application/zip"}).size}catch(t){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);n.append(i),r.blob=0===n.getBlob("application/zip").size}catch(t){r.blob=!1}}}try{r.nodestream=!!t("readable-stream").Readable}catch(t){r.nodestream=!1}},{"readable-stream":16}],31:[function(t,e,s){"use strict";for(var o=t("./utils"),h=t("./support"),r=t("./nodejsUtils"),i=t("./stream/GenericWorker"),u=new Array(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;u[254]=u[254]=1;function a(){i.call(this,"utf-8 decode"),this.leftOver=null}function l(){i.call(this,"utf-8 encode")}s.utf8encode=function(t){return h.nodebuffer?r.newBufferFrom(t,"utf-8"):function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=h.uint8array?new Uint8Array(o):new Array(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e}(t)},s.utf8decode=function(t){return h.nodebuffer?o.transformTo("nodebuffer",t).toString("utf-8"):function(t){var e,r,i,n,s=t.length,a=new Array(2*s);for(e=r=0;e<s;)if((i=t[e++])<128)a[r++]=i;else if(4<(n=u[i]))a[r++]=65533,e+=n-1;else{for(i&=2===n?31:3===n?15:7;1<n&&e<s;)i=i<<6|63&t[e++],n--;1<n?a[r++]=65533:i<65536?a[r++]=i:(i-=65536,a[r++]=55296|i>>10&1023,a[r++]=56320|1023&i)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(t=o.transformTo(h.uint8array?"uint8array":"array",t))},o.inherits(a,i),a.prototype.processChunk=function(t){var e=o.transformTo(h.uint8array?"uint8array":"array",t.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=e;(e=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),e.set(r,this.leftOver.length)}else e=this.leftOver.concat(e);this.leftOver=null}var i=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}(e),n=e;i!==e.length&&(h.uint8array?(n=e.subarray(0,i),this.leftOver=e.subarray(i,e.length)):(n=e.slice(0,i),this.leftOver=e.slice(i,e.length))),this.push({data:s.utf8decode(n),meta:t.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,i),l.prototype.processChunk=function(t){this.push({data:s.utf8encode(t.data),meta:t.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(t,e,a){"use strict";var o=t("./support"),h=t("./base64"),r=t("./nodejsUtils"),i=t("set-immediate-shim"),u=t("./external");function n(t){return t}function l(t,e){for(var r=0;r<t.length;++r)e[r]=255&t.charCodeAt(r);return e}a.newBlob=function(e,r){a.checkSupport("blob");try{return new Blob([e],{type:r})}catch(t){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return i.append(e),i.getBlob(r)}catch(t){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(t,e,r){var i=[],n=0,s=t.length;if(s<=r)return String.fromCharCode.apply(null,t);for(;n<s;)"array"===e||"nodebuffer"===e?i.push(String.fromCharCode.apply(null,t.slice(n,Math.min(n+r,s)))):i.push(String.fromCharCode.apply(null,t.subarray(n,Math.min(n+r,s)))),n+=r;return i.join("")},stringifyByChar:function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(t){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(t){return!1}}()}};function f(t){var e=65536,r=a.getTypeOf(t),i=!0;if("uint8array"===r?i=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(i=s.applyCanBeUsed.nodebuffer),i)for(;1<e;)try{return s.stringifyByChunk(t,r,e)}catch(t){e=Math.floor(e/2)}return s.stringifyByChar(t)}function d(t,e){for(var r=0;r<t.length;r++)e[r]=t[r];return e}a.applyFromCharCode=f;var c={};c.string={string:n,array:function(t){return l(t,new Array(t.length))},arraybuffer:function(t){return c.string.uint8array(t).buffer},uint8array:function(t){return l(t,new Uint8Array(t.length))},nodebuffer:function(t){return l(t,r.allocBuffer(t.length))}},c.array={string:f,array:n,arraybuffer:function(t){return new Uint8Array(t).buffer},uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(t)}},c.arraybuffer={string:function(t){return f(new Uint8Array(t))},array:function(t){return d(new Uint8Array(t),new Array(t.byteLength))},arraybuffer:n,uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(new Uint8Array(t))}},c.uint8array={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return t.buffer},uint8array:n,nodebuffer:function(t){return r.newBufferFrom(t)}},c.nodebuffer={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return c.nodebuffer.uint8array(t).buffer},uint8array:function(t){return d(t,new Uint8Array(t.length))},nodebuffer:n},a.transformTo=function(t,e){if(e=e||"",!t)return e;a.checkSupport(t);var r=a.getTypeOf(e);return c[r][t](e)},a.getTypeOf=function(t){return"string"==typeof t?"string":"[object Array]"===Object.prototype.toString.call(t)?"array":o.nodebuffer&&r.isBuffer(t)?"nodebuffer":o.uint8array&&t instanceof Uint8Array?"uint8array":o.arraybuffer&&t instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(t){if(!o[t.toLowerCase()])throw new Error(t+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(t){var e,r,i="";for(r=0;r<(t||"").length;r++)i+="\\x"+((e=t.charCodeAt(r))<16?"0":"")+e.toString(16).toUpperCase();return i},a.delay=function(t,e,r){i(function(){t.apply(r||null,e||[])})},a.inherits=function(t,e){function r(){}r.prototype=e.prototype,t.prototype=new r},a.extend=function(){var t,e,r={};for(t=0;t<arguments.length;t++)for(e in arguments[t])arguments[t].hasOwnProperty(e)&&void 0===r[e]&&(r[e]=arguments[t][e]);return r},a.prepareContent=function(r,t,i,n,s){return u.Promise.resolve(t).then(function(i){return o.blob&&(i instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(i)))&&"undefined"!=typeof FileReader?new u.Promise(function(e,r){var t=new FileReader;t.onload=function(t){e(t.target.result)},t.onerror=function(t){r(t.target.error)},t.readAsArrayBuffer(i)}):i}).then(function(t){var e=a.getTypeOf(t);return e?("arraybuffer"===e?t=a.transformTo("uint8array",t):"string"===e&&(s?t=h.decode(t):i&&!0!==n&&(t=function(t){return l(t,o.uint8array?new Uint8Array(t.length):new Array(t.length))}(t))),t):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),n=t("./utils"),s=t("./signature"),a=t("./zipEntry"),o=(t("./utf8"),t("./support"));function h(t){this.files=[],this.loadOptions=t}h.prototype={checkSignature:function(t){if(!this.reader.readAndCheckSignature(t)){this.reader.index-=4;var e=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+n.pretty(e)+", expected "+n.pretty(t)+")")}},isSignature:function(t,e){var r=this.reader.index;this.reader.setIndex(t);var i=this.reader.readString(4)===e;return this.reader.setIndex(r),i},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var t=this.reader.readData(this.zipCommentLength),e=o.uint8array?"uint8array":"array",r=n.transformTo(e,t);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var t,e,r,i=this.zip64EndOfCentralSize-44;0<i;)t=this.reader.readInt(2),e=this.reader.readInt(4),r=this.reader.readData(e),this.zip64ExtensibleData[t]={id:t,length:e,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var t,e;for(t=0;t<this.files.length;t++)e=this.files[t],this.reader.setIndex(e.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),e.readLocalPart(this.reader),e.handleUTF8(),e.processAttributes()},readCentralDir:function(){var t;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(t=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(t);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var t=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(t<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(t);var e=t;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===n.MAX_VALUE_16BITS||this.diskWithCentralDirStart===n.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===n.MAX_VALUE_16BITS||this.centralDirRecords===n.MAX_VALUE_16BITS||this.centralDirSize===n.MAX_VALUE_32BITS||this.centralDirOffset===n.MAX_VALUE_32BITS){if(this.zip64=!0,(t=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(t),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var i=e-r;if(0<i)this.isSignature(e,s.CENTRAL_FILE_HEADER)||(this.reader.zero=i);else if(i<0)throw new Error("Corrupted zip: missing "+Math.abs(i)+" bytes.")},prepareReader:function(t){this.reader=i(t)},load:function(t){this.prepareReader(t),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},e.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),s=t("./utils"),n=t("./compressedObject"),a=t("./crc32"),o=t("./utf8"),h=t("./compressions"),u=t("./support");function l(t,e){this.options=t,this.loadOptions=e}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(t){var e,r;if(t.skip(22),this.fileNameLength=t.readInt(2),r=t.readInt(2),this.fileName=t.readData(this.fileNameLength),t.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(e=function(t){for(var e in h)if(h.hasOwnProperty(e)&&h[e].magic===t)return h[e];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new n(this.compressedSize,this.uncompressedSize,this.crc32,e,t.readData(this.compressedSize))},readCentralPart:function(t){this.versionMadeBy=t.readInt(2),t.skip(2),this.bitFlag=t.readInt(2),this.compressionMethod=t.readString(2),this.date=t.readDate(),this.crc32=t.readInt(4),this.compressedSize=t.readInt(4),this.uncompressedSize=t.readInt(4);var e=t.readInt(2);if(this.extraFieldsLength=t.readInt(2),this.fileCommentLength=t.readInt(2),this.diskNumberStart=t.readInt(2),this.internalFileAttributes=t.readInt(2),this.externalFileAttributes=t.readInt(4),this.localHeaderOffset=t.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");t.skip(e),this.readExtraFields(t),this.parseZIP64ExtraField(t),this.fileComment=t.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var t=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==t&&(this.dosPermissions=63&this.externalFileAttributes),3==t&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(t){if(this.extraFields[1]){var e=i(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(t){var e,r,i,n=t.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});t.index+4<n;)e=t.readInt(2),r=t.readInt(2),i=t.readData(r),this.extraFields[e]={id:e,length:r,value:i};t.setIndex(n)},handleUTF8:function(){var t=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var e=this.findExtraFieldUnicodePath();if(null!==e)this.fileNameStr=e;else{var r=s.transformTo(t,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var i=this.findExtraFieldUnicodeComment();if(null!==i)this.fileCommentStr=i;else{var n=s.transformTo(t,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(n)}}},findExtraFieldUnicodePath:function(){var t=this.extraFields[28789];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileName)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null},findExtraFieldUnicodeComment:function(){var t=this.extraFields[25461];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileComment)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null}},e.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(t,e,r){"use strict";function i(t,e,r){this.name=t,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=e,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=t("./stream/StreamHelper"),n=t("./stream/DataWorker"),a=t("./utf8"),o=t("./compressedObject"),h=t("./stream/GenericWorker");i.prototype={internalStream:function(t){var e=null,r="string";try{if(!t)throw new Error("No output type specified.");var i="string"===(r=t.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),e=this._decompressWorker();var n=!this._dataBinary;n&&!i&&(e=e.pipe(new a.Utf8EncodeWorker)),!n&&i&&(e=e.pipe(new a.Utf8DecodeWorker))}catch(t){(e=new h("error")).error(t)}return new s(e,r,"")},async:function(t,e){return this.internalStream(t).accumulate(e)},nodeStream:function(t,e){return this.internalStream(t||"nodebuffer").toNodejsStream(e)},_compressWorker:function(t,e){if(this._data instanceof o&&this._data.compression.magic===t.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,t,e)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new n(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)i.prototype[u[f]]=l;e.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(t,l,e){(function(e){"use strict";var r,i,t=e.MutationObserver||e.WebKitMutationObserver;if(t){var n=0,s=new t(u),a=e.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=n=++n%2}}else if(e.setImmediate||void 0===e.MessageChannel)r="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var o=new e.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var t,e;i=!0;for(var r=h.length;r;){for(e=h,h=[],t=-1;++t<r;)e[t]();r=h.length}i=!1}l.exports=function(t){1!==h.push(t)||i||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(t,e,r){"use strict";var n=t("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],i=["PENDING"];function o(t){if("function"!=typeof t)throw new TypeError("resolver must be a function");this.state=i,this.queue=[],this.outcome=void 0,t!==u&&c(this,t)}function h(t,e,r){this.promise=t,"function"==typeof e&&(this.onFulfilled=e,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(e,r,i){n(function(){var t;try{t=r(i)}catch(t){return l.reject(e,t)}t===e?l.reject(e,new TypeError("Cannot resolve promise with itself")):l.resolve(e,t)})}function d(t){var e=t&&t.then;if(t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof e)return function(){e.apply(t,arguments)}}function c(e,t){var r=!1;function i(t){r||(r=!0,l.reject(e,t))}function n(t){r||(r=!0,l.resolve(e,t))}var s=p(function(){t(n,i)});"error"===s.status&&i(s.value)}function p(t,e){var r={};try{r.value=t(e),r.status="success"}catch(t){r.status="error",r.value=t}return r}(e.exports=o).prototype.finally=function(e){if("function"!=typeof e)return this;var r=this.constructor;return this.then(function(t){return r.resolve(e()).then(function(){return t})},function(t){return r.resolve(e()).then(function(){throw t})})},o.prototype.catch=function(t){return this.then(null,t)},o.prototype.then=function(t,e){if("function"!=typeof t&&this.state===a||"function"!=typeof e&&this.state===s)return this;var r=new this.constructor(u);this.state!==i?f(r,this.state===a?t:e,this.outcome):this.queue.push(new h(r,t,e));return r},h.prototype.callFulfilled=function(t){l.resolve(this.promise,t)},h.prototype.otherCallFulfilled=function(t){f(this.promise,this.onFulfilled,t)},h.prototype.callRejected=function(t){l.reject(this.promise,t)},h.prototype.otherCallRejected=function(t){f(this.promise,this.onRejected,t)},l.resolve=function(t,e){var r=p(d,e);if("error"===r.status)return l.reject(t,r.value);var i=r.value;if(i)c(t,i);else{t.state=a,t.outcome=e;for(var n=-1,s=t.queue.length;++n<s;)t.queue[n].callFulfilled(e)}return t},l.reject=function(t,e){t.state=s,t.outcome=e;for(var r=-1,i=t.queue.length;++r<i;)t.queue[r].callRejected(e);return t},o.resolve=function(t){if(t instanceof this)return t;return l.resolve(new this(u),t)},o.reject=function(t){var e=new this(u);return l.reject(e,t)},o.all=function(t){var r=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var i=t.length,n=!1;if(!i)return this.resolve([]);var s=new Array(i),a=0,e=-1,o=new this(u);for(;++e<i;)h(t[e],e);return o;function h(t,e){r.resolve(t).then(function(t){s[e]=t,++a!==i||n||(n=!0,l.resolve(o,s))},function(t){n||(n=!0,l.reject(o,t))})}},o.race=function(t){var e=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var r=t.length,i=!1;if(!r)return this.resolve([]);var n=-1,s=new this(u);for(;++n<r;)a=t[n],e.resolve(a).then(function(t){i||(i=!0,l.resolve(s,t))},function(t){i||(i=!0,l.reject(s,t))});var a;return s}},{immediate:36}],38:[function(t,e,r){"use strict";var i={};(0,t("./lib/utils/common").assign)(i,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=i},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(t,e,r){"use strict";var a=t("./zlib/deflate"),o=t("./utils/common"),h=t("./utils/strings"),n=t("./zlib/messages"),s=t("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,d=0,c=8;function p(t){if(!(this instanceof p))return new p(t);this.options=o.assign({level:f,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(r!==l)throw new Error(n[r]);if(e.header&&a.deflateSetHeader(this.strm,e.header),e.dictionary){var i;if(i="string"==typeof e.dictionary?h.string2buf(e.dictionary):"[object ArrayBuffer]"===u.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(r=a.deflateSetDictionary(this.strm,i))!==l)throw new Error(n[r]);this._dict_set=!0}}function i(t,e){var r=new p(e);if(r.push(t,!0),r.err)throw r.msg||n[r.err];return r.result}p.prototype.push=function(t,e){var r,i,n=this.strm,s=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:!0===e?4:0,"string"==typeof t?n.input=h.string2buf(t):"[object ArrayBuffer]"===u.call(t)?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(s),n.next_out=0,n.avail_out=s),1!==(r=a.deflate(n,i))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==n.avail_out&&(0!==n.avail_in||4!==i&&2!==i)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(n.output,n.next_out))):this.onData(o.shrinkBuf(n.output,n.next_out)))}while((0<n.avail_in||0===n.avail_out)&&1!==r);return 4===i?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==i||(this.onEnd(l),!(n.avail_out=0))},p.prototype.onData=function(t){this.chunks.push(t)},p.prototype.onEnd=function(t){t===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Deflate=p,r.deflate=i,r.deflateRaw=function(t,e){return(e=e||{}).raw=!0,i(t,e)},r.gzip=function(t,e){return(e=e||{}).gzip=!0,i(t,e)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(t,e,r){"use strict";var d=t("./zlib/inflate"),c=t("./utils/common"),p=t("./utils/strings"),m=t("./zlib/constants"),i=t("./zlib/messages"),n=t("./zlib/zstream"),s=t("./zlib/gzheader"),_=Object.prototype.toString;function a(t){if(!(this instanceof a))return new a(t);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new n,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,e.windowBits);if(r!==m.Z_OK)throw new Error(i[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header)}function o(t,e){var r=new a(e);if(r.push(t,!0),r.err)throw r.msg||i[r.err];return r.result}a.prototype.push=function(t,e){var r,i,n,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;i=e===~~e?e:!0===e?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof t?h.input=p.binstring2buf(t):"[object ArrayBuffer]"===_.call(t)?h.input=new Uint8Array(t):h.input=t,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new c.Buf8(u),h.next_out=0,h.avail_out=u),(r=d.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||i!==m.Z_FINISH&&i!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(n=p.utf8border(h.output,h.next_out),s=h.next_out-n,a=p.buf2string(h.output,n),h.next_out=s,h.avail_out=u-s,s&&c.arraySet(h.output,h.output,n,s,0),this.onData(a)):this.onData(c.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(i=m.Z_FINISH),i===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):i!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(t){this.chunks.push(t)},a.prototype.onEnd=function(t){t===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(t,e){return(e=e||{}).raw=!0,o(t,e)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var i in r)r.hasOwnProperty(i)&&(t[i]=r[i])}}return t},r.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,r,i,n){if(e.subarray&&t.subarray)t.set(e.subarray(r,r+i),n);else for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){var e,r,i,n,s,a;for(e=i=0,r=t.length;e<r;e++)i+=t[e].length;for(a=new Uint8Array(i),e=n=0,r=t.length;e<r;e++)s=t[e],a.set(s,n),n+=s.length;return a}},s={arraySet:function(t,e,r,i,n){for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){return[].concat.apply([],t)}};r.setTyped=function(t){t?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,n)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(i)},{}],42:[function(t,e,r){"use strict";var h=t("./common"),n=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(t){n=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){s=!1}for(var u=new h.Buf8(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function l(t,e){if(e<65537&&(t.subarray&&s||!t.subarray&&n))return String.fromCharCode.apply(null,h.shrinkBuf(t,e));for(var r="",i=0;i<e;i++)r+=String.fromCharCode(t[i]);return r}u[254]=u[254]=1,r.string2buf=function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=new h.Buf8(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e},r.buf2binstring=function(t){return l(t,t.length)},r.binstring2buf=function(t){for(var e=new h.Buf8(t.length),r=0,i=e.length;r<i;r++)e[r]=t.charCodeAt(r);return e},r.buf2string=function(t,e){var r,i,n,s,a=e||t.length,o=new Array(2*a);for(r=i=0;r<a;)if((n=t[r++])<128)o[i++]=n;else if(4<(s=u[n]))o[i++]=65533,r+=s-1;else{for(n&=2===s?31:3===s?15:7;1<s&&r<a;)n=n<<6|63&t[r++],s--;1<s?o[i++]=65533:n<65536?o[i++]=n:(n-=65536,o[i++]=55296|n>>10&1023,o[i++]=56320|1023&n)}return l(o,i)},r.utf8border=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}},{"./common":41}],43:[function(t,e,r){"use strict";e.exports=function(t,e,r,i){for(var n=65535&t|0,s=t>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(n=n+e[i++]|0)|0,--a;);n%=65521,s%=65521}return n|s<<16|0}},{}],44:[function(t,e,r){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(t,e,r){"use strict";var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}},{}],46:[function(t,e,r){"use strict";var h,d=t("../utils/common"),u=t("./trees"),c=t("./adler32"),p=t("./crc32"),i=t("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,n=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(t,e){return t.msg=i[e],e}function T(t){return(t<<1)-(4<t?9:0)}function D(t){for(var e=t.length;0<=--e;)t[e]=0}function F(t){var e=t.state,r=e.pending;r>t.avail_out&&(r=t.avail_out),0!==r&&(d.arraySet(t.output,e.pending_buf,e.pending_out,r,t.next_out),t.next_out+=r,e.pending_out+=r,t.total_out+=r,t.avail_out-=r,e.pending-=r,0===e.pending&&(e.pending_out=0))}function N(t,e){u._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,F(t.strm)}function U(t,e){t.pending_buf[t.pending++]=e}function P(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function L(t,e){var r,i,n=t.max_chain_length,s=t.strstart,a=t.prev_length,o=t.nice_match,h=t.strstart>t.w_size-z?t.strstart-(t.w_size-z):0,u=t.window,l=t.w_mask,f=t.prev,d=t.strstart+S,c=u[s+a-1],p=u[s+a];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(u[(r=e)+a]===p&&u[r+a-1]===c&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<d);if(i=S-(d-s),s=d-S,a<i){if(t.match_start=e,o<=(a=i))break;c=u[s+a-1],p=u[s+a]}}}while((e=f[e&l])>h&&0!=--n);return a<=t.lookahead?a:t.lookahead}function j(t){var e,r,i,n,s,a,o,h,u,l,f=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=f+(f-z)){for(d.arraySet(t.window,t.window,f,f,0),t.match_start-=f,t.strstart-=f,t.block_start-=f,e=r=t.hash_size;i=t.head[--e],t.head[e]=f<=i?i-f:0,--r;);for(e=r=f;i=t.prev[--e],t.prev[e]=f<=i?i-f:0,--r;);n+=f}if(0===t.strm.avail_in)break;if(a=t.strm,o=t.window,h=t.strstart+t.lookahead,u=n,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,d.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=c(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),t.lookahead+=r,t.lookahead+t.insert>=x)for(s=t.strstart-t.insert,t.ins_h=t.window[s],t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+x-1])&t.hash_mask,t.prev[s&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=s,s++,t.insert--,!(t.lookahead+t.insert<x)););}while(t.lookahead<z&&0!==t.strm.avail_in)}function Z(t,e){for(var r,i;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==r&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r)),t.match_length>=x)if(i=u._tr_tally(t,t.strstart-t.match_start,t.match_length-x),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=x){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function W(t,e){for(var r,i,n;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=x-1,0!==r&&t.prev_length<t.max_lazy_match&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r),t.match_length<=5&&(1===t.strategy||t.match_length===x&&4096<t.strstart-t.match_start)&&(t.match_length=x-1)),t.prev_length>=x&&t.match_length<=t.prev_length){for(n=t.strstart+t.lookahead-x,i=u._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-x),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=x-1,t.strstart++,i&&(N(t,!1),0===t.strm.avail_out))return A}else if(t.match_available){if((i=u._tr_tally(t,0,t.window[t.strstart-1]))&&N(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return A}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=u._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function M(t,e,r,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=r,this.max_chain=i,this.func=n}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*w),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(k+1),this.heap=new d.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=n,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?C:E,t.adler=2===e.wrap?0:1,e.last_flush=l,u._tr_init(e),m):R(t,_)}function K(t){var e=G(t);return e===m&&function(t){t.window_size=2*t.w_size,D(t.head),t.max_lazy_match=h[t.level].max_lazy,t.good_match=h[t.level].good_length,t.nice_match=h[t.level].nice_length,t.max_chain_length=h[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=x-1,t.match_available=0,t.ins_h=0}(t.state),e}function Y(t,e,r,i,n,s){if(!t)return _;var a=1;if(e===g&&(e=6),i<0?(a=0,i=-i):15<i&&(a=2,i-=16),n<1||y<n||r!==v||i<8||15<i||e<0||9<e||s<0||b<s)return R(t,_);8===i&&(i=9);var o=new H;return(t.state=o).strm=t,o.wrap=a,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=s,o.method=r,K(t)}h=[new M(0,0,0,0,function(t,e){var r=65535;for(r>t.pending_buf_size-5&&(r=t.pending_buf_size-5);;){if(t.lookahead<=1){if(j(t),0===t.lookahead&&e===l)return A;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+r;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,N(t,!1),0===t.strm.avail_out))return A;if(t.strstart-t.block_start>=t.w_size-z&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):(t.strstart>t.block_start&&(N(t,!1),t.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(t,e){return Y(t,e,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?_:(t.state.gzhead=e,m):_},r.deflate=function(t,e){var r,i,n,s;if(!t||!t.state||5<e||e<0)return t?R(t,_):_;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&e!==f)return R(t,0===t.avail_out?-5:_);if(i.strm=t,r=i.last_flush,i.last_flush=e,i.status===C)if(2===i.wrap)t.adler=0,U(i,31),U(i,139),U(i,8),i.gzhead?(U(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),U(i,255&i.gzhead.time),U(i,i.gzhead.time>>8&255),U(i,i.gzhead.time>>16&255),U(i,i.gzhead.time>>24&255),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(U(i,255&i.gzhead.extra.length),U(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=p(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(U(i,0),U(i,0),U(i,0),U(i,0),U(i,0),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,3),i.status=E);else{var a=v+(i.w_bits-8<<4)<<8;a|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(a|=32),a+=31-a%31,i.status=E,P(i,a),0!==i.strstart&&(P(i,t.adler>>>16),P(i,65535&t.adler)),t.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending!==i.pending_buf_size));)U(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(t),i.pending+2<=i.pending_buf_size&&(U(i,255&t.adler),U(i,t.adler>>8&255),t.adler=0,i.status=E)):i.status=E),0!==i.pending){if(F(t),0===t.avail_out)return i.last_flush=-1,m}else if(0===t.avail_in&&T(e)<=T(r)&&e!==f)return R(t,-5);if(666===i.status&&0!==t.avail_in)return R(t,-5);if(0!==t.avail_in||0!==i.lookahead||e!==l&&666!==i.status){var o=2===i.strategy?function(t,e){for(var r;;){if(0===t.lookahead&&(j(t),0===t.lookahead)){if(e===l)return A;break}if(t.match_length=0,r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):3===i.strategy?function(t,e){for(var r,i,n,s,a=t.window;;){if(t.lookahead<=S){if(j(t),t.lookahead<=S&&e===l)return A;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=x&&0<t.strstart&&(i=a[n=t.strstart-1])===a[++n]&&i===a[++n]&&i===a[++n]){s=t.strstart+S;do{}while(i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&n<s);t.match_length=S-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=x?(r=u._tr_tally(t,1,t.match_length-x),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):h[i.level].func(i,e);if(o!==O&&o!==B||(i.status=666),o===A||o===O)return 0===t.avail_out&&(i.last_flush=-1),m;if(o===I&&(1===e?u._tr_align(i):5!==e&&(u._tr_stored_block(i,0,0,!1),3===e&&(D(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),F(t),0===t.avail_out))return i.last_flush=-1,m}return e!==f?m:i.wrap<=0?1:(2===i.wrap?(U(i,255&t.adler),U(i,t.adler>>8&255),U(i,t.adler>>16&255),U(i,t.adler>>24&255),U(i,255&t.total_in),U(i,t.total_in>>8&255),U(i,t.total_in>>16&255),U(i,t.total_in>>24&255)):(P(i,t.adler>>>16),P(i,65535&t.adler)),F(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?m:1)},r.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==C&&69!==e&&73!==e&&91!==e&&103!==e&&e!==E&&666!==e?R(t,_):(t.state=null,e===E?R(t,-3):m):_},r.deflateSetDictionary=function(t,e){var r,i,n,s,a,o,h,u,l=e.length;if(!t||!t.state)return _;if(2===(s=(r=t.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(t.adler=c(t.adler,e,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new d.Buf8(r.w_size),d.arraySet(u,e,l-r.w_size,r.w_size,0),e=u,l=r.w_size),a=t.avail_in,o=t.next_in,h=t.input,t.avail_in=l,t.next_in=0,t.input=e,j(r);r.lookahead>=x;){for(i=r.strstart,n=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[i+x-1])&r.hash_mask,r.prev[i&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=i,i++,--n;);r.strstart=i,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,t.next_in=o,t.input=h,t.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(t,e,r){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(t,e,r){"use strict";e.exports=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C;r=t.state,i=t.next_in,z=t.input,n=i+(t.avail_in-5),s=t.next_out,C=t.output,a=s-(e-t.avail_out),o=s+(t.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;t:do{p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=m[c&g];e:for(;;){if(c>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(c&(1<<y)-1)];continue e}if(32&y){r.mode=12;break t}t.msg="invalid literal/length code",r.mode=30;break t}w=65535&v,(y&=15)&&(p<y&&(c+=z[i++]<<p,p+=8),w+=c&(1<<y)-1,c>>>=y,p-=y),p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=_[c&b];r:for(;;){if(c>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(c&(1<<y)-1)];continue r}t.msg="invalid distance code",r.mode=30;break t}if(k=65535&v,p<(y&=15)&&(c+=z[i++]<<p,(p+=8)<y&&(c+=z[i++]<<p,p+=8)),h<(k+=c&(1<<y)-1)){t.msg="invalid distance too far back",r.mode=30;break t}if(c>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){t.msg="invalid distance too far back",r.mode=30;break t}if(S=d,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=d[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=d[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(i<n&&s<o);i-=w=p>>3,c&=(1<<(p-=w<<3))-1,t.next_in=i,t.next_out=s,t.avail_in=i<n?n-i+5:5-(i-n),t.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p}},{}],49:[function(t,e,r){"use strict";var I=t("../utils/common"),O=t("./adler32"),B=t("./crc32"),R=t("./inffast"),T=t("./inftrees"),D=1,F=2,N=0,U=-2,P=1,i=852,n=592;function L(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=P,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new I.Buf32(i),e.distcode=e.distdyn=new I.Buf32(n),e.sane=1,e.back=-1,N):U}function o(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,a(t)):U}function h(t,e){var r,i;return t&&t.state?(i=t.state,e<0?(r=0,e=-e):(r=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?U:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=r,i.wbits=e,o(t))):U}function u(t,e){var r,i;return t?(i=new s,(t.state=i).window=null,(r=h(t,e))!==N&&(t.state=null),r):U}var l,f,d=!0;function j(t){if(d){var e;for(l=new I.Buf32(512),f=new I.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(T(D,t.lens,0,288,l,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;T(F,t.lens,0,32,f,0,t.work,{bits:5}),d=!1}t.lencode=l,t.lenbits=9,t.distcode=f,t.distbits=5}function Z(t,e,r,i){var n,s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),i>=s.wsize?(I.arraySet(s.window,e,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(i<(n=s.wsize-s.wnext)&&(n=i),I.arraySet(s.window,e,r-i,n,s.wnext),(i-=n)?(I.arraySet(s.window,e,r-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(t){return u(t,15)},r.inflateInit2=u,r.inflate=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return U;12===(r=t.state).mode&&(r.mode=13),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,f=o,d=h,x=N;t:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){t.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){t.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){t.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,t.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){t.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){t.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,i,s,c,k)),512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,r.length-=c),r.length))break t;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(65535&r.check)){t.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),t.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}t.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,2;t.adler=r.check=1,r.mode=12;case 12:if(5===e||6===e)break t;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==e)break;u>>>=2,l-=2;break t;case 2:r.mode=17;break;case 3:t.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){t.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===e)break t;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),h<c&&(c=h),0===c)break t;I.arraySet(n,i,s,c,a),o-=c,s+=c,h-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){t.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){t.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+c>r.nlen+r.ndist){t.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){t.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){t.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===e)break t;case 20:r.mode=21;case 21:if(6<=o&&258<=h){t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,R(t,d),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){t.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){t.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){t.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break t;if(c=d-h,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){t.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window}else m=n,p=a-r.offset,c=r.length;for(h<c&&(c=h),h-=c,r.length-=c;n[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break t;n[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break t;o--,u|=i[s++]<<l,l+=8}if(d-=h,t.total_out+=d,r.total+=d,d&&(t.adler=r.check=r.flags?B(r.check,n,d,a-d):O(r.check,n,d,a-d)),d=h,(r.flags?u:L(u))!==r.check){t.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(4294967295&r.total)){t.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break t;case 30:x=-3;break t;case 31:return-4;case 32:default:return U}return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,(r.wsize||d!==t.avail_out&&r.mode<30&&(r.mode<27||4!==e))&&Z(t,t.output,t.next_out,d-t.avail_out)?(r.mode=31,-4):(f-=t.avail_in,d-=t.avail_out,t.total_in+=f,t.total_out+=d,r.total+=d,r.wrap&&d&&(t.adler=r.check=r.flags?B(r.check,n,d,t.next_out-d):O(r.check,n,d,t.next_out-d)),t.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===d||4===e)&&x===N&&(x=-5),x)},r.inflateEnd=function(t){if(!t||!t.state)return U;var e=t.state;return e.window&&(e.window=null),t.state=null,N},r.inflateGetHeader=function(t,e){var r;return t&&t.state?0==(2&(r=t.state).wrap)?U:((r.head=e).done=!1,N):U},r.inflateSetDictionary=function(t,e){var r,i=e.length;return t&&t.state?0!==(r=t.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,e,i,0)!==r.check?-3:Z(t,e,i,i)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(t,e,r){"use strict";var D=t("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,r,i,n,s,a,o){var h,u,l,f,d,c,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<i;v++)O[e[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===t||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<i;v++)0!==e[r+v]&&(a[B[e[r+v]]++]=v);if(c=0===t?(A=R=a,19):1===t?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,d=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===t&&852<C||2===t&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<c?(m=0,a[v]):a[v]>c?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;n[d+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=e[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),d+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===t&&852<C||2===t&&592<C)return 1;n[l=E&f]=k<<24|x<<16|d-s|0}}return 0!==E&&(n[d+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(t,e,r){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(t,e,r){"use strict";var n=t("../utils/common"),o=0,h=1;function i(t){for(var e=t.length;0<=--e;)t[e]=0}var s=0,a=29,u=256,l=u+1+a,f=30,d=19,_=2*l+1,g=15,c=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));i(z);var C=new Array(2*f);i(C);var E=new Array(512);i(E);var A=new Array(256);i(A);var I=new Array(a);i(I);var O,B,R,T=new Array(f);function D(t,e,r,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=r,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}function F(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function N(t){return t<256?E[t]:E[256+(t>>>7)]}function U(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function P(t,e,r){t.bi_valid>c-r?(t.bi_buf|=e<<t.bi_valid&65535,U(t,t.bi_buf),t.bi_buf=e>>c-t.bi_valid,t.bi_valid+=r-c):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=r)}function L(t,e,r){P(t,r[2*e],r[2*e+1])}function j(t,e){for(var r=0;r|=1&t,t>>>=1,r<<=1,0<--e;);return r>>>1}function Z(t,e,r){var i,n,s=new Array(g+1),a=0;for(i=1;i<=g;i++)s[i]=a=a+r[i-1]<<1;for(n=0;n<=e;n++){var o=t[2*n+1];0!==o&&(t[2*n]=j(s[o]++,o))}}function W(t){var e;for(e=0;e<l;e++)t.dyn_ltree[2*e]=0;for(e=0;e<f;e++)t.dyn_dtree[2*e]=0;for(e=0;e<d;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*m]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?U(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function H(t,e,r,i){var n=2*e,s=2*r;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[r]}function G(t,e,r){for(var i=t.heap[r],n=r<<1;n<=t.heap_len&&(n<t.heap_len&&H(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!H(e,i,t.heap[n],t.depth));)t.heap[r]=t.heap[n],r=n,n<<=1;t.heap[r]=i}function K(t,e,r){var i,n,s,a,o=0;if(0!==t.last_lit)for(;i=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],n=t.pending_buf[t.l_buf+o],o++,0===i?L(t,n,e):(L(t,(s=A[n])+u+1,e),0!==(a=w[s])&&P(t,n-=I[s],a),L(t,s=N(--i),r),0!==(a=k[s])&&P(t,i-=T[s],a)),o<t.last_lit;);L(t,m,e)}function Y(t,e){var r,i,n,s=e.dyn_tree,a=e.stat_desc.static_tree,o=e.stat_desc.has_stree,h=e.stat_desc.elems,u=-1;for(t.heap_len=0,t.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(t.heap[++t.heap_len]=u=r,t.depth[r]=0):s[2*r+1]=0;for(;t.heap_len<2;)s[2*(n=t.heap[++t.heap_len]=u<2?++u:0)]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=a[2*n+1]);for(e.max_code=u,r=t.heap_len>>1;1<=r;r--)G(t,s,r);for(n=h;r=t.heap[1],t.heap[1]=t.heap[t.heap_len--],G(t,s,1),i=t.heap[1],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=i,s[2*n]=s[2*r]+s[2*i],t.depth[n]=(t.depth[r]>=t.depth[i]?t.depth[r]:t.depth[i])+1,s[2*r+1]=s[2*i+1]=n,t.heap[1]=n++,G(t,s,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var r,i,n,s,a,o,h=e.dyn_tree,u=e.max_code,l=e.stat_desc.static_tree,f=e.stat_desc.has_stree,d=e.stat_desc.extra_bits,c=e.stat_desc.extra_base,p=e.stat_desc.max_length,m=0;for(s=0;s<=g;s++)t.bl_count[s]=0;for(h[2*t.heap[t.heap_max]+1]=0,r=t.heap_max+1;r<_;r++)p<(s=h[2*h[2*(i=t.heap[r])+1]+1]+1)&&(s=p,m++),h[2*i+1]=s,u<i||(t.bl_count[s]++,a=0,c<=i&&(a=d[i-c]),o=h[2*i],t.opt_len+=o*(s+a),f&&(t.static_len+=o*(l[2*i+1]+a)));if(0!==m){do{for(s=p-1;0===t.bl_count[s];)s--;t.bl_count[s]--,t.bl_count[s+1]+=2,t.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(i=t.bl_count[s];0!==i;)u<(n=t.heap[--r])||(h[2*n+1]!==s&&(t.opt_len+=(s-h[2*n+1])*h[2*n],h[2*n+1]=s),i--)}}(t,e),Z(s,u,t.bl_count)}function X(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),e[2*(r+1)+1]=65535,i=0;i<=r;i++)n=a,a=e[2*(i+1)+1],++o<h&&n===a||(o<u?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[2*b]++):o<=10?t.bl_tree[2*v]++:t.bl_tree[2*y]++,s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4))}function V(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),i=0;i<=r;i++)if(n=a,a=e[2*(i+1)+1],!(++o<h&&n===a)){if(o<u)for(;L(t,n,t.bl_tree),0!=--o;);else 0!==n?(n!==s&&(L(t,n,t.bl_tree),o--),L(t,b,t.bl_tree),P(t,o-3,2)):o<=10?(L(t,v,t.bl_tree),P(t,o-3,3)):(L(t,y,t.bl_tree),P(t,o-11,7));s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4)}}i(T);var q=!1;function J(t,e,r,i){P(t,(s<<1)+(i?1:0),3),function(t,e,r,i){M(t),i&&(U(t,r),U(t,~r)),n.arraySet(t.pending_buf,t.window,e,r,t.pending),t.pending+=r}(t,e,r,!0)}r._tr_init=function(t){q||(function(){var t,e,r,i,n,s=new Array(g+1);for(i=r=0;i<a-1;i++)for(I[i]=r,t=0;t<1<<w[i];t++)A[r++]=i;for(A[r-1]=i,i=n=0;i<16;i++)for(T[i]=n,t=0;t<1<<k[i];t++)E[n++]=i;for(n>>=7;i<f;i++)for(T[i]=n<<7,t=0;t<1<<k[i]-7;t++)E[256+n++]=i;for(e=0;e<=g;e++)s[e]=0;for(t=0;t<=143;)z[2*t+1]=8,t++,s[8]++;for(;t<=255;)z[2*t+1]=9,t++,s[9]++;for(;t<=279;)z[2*t+1]=7,t++,s[7]++;for(;t<=287;)z[2*t+1]=8,t++,s[8]++;for(Z(z,l+1,s),t=0;t<f;t++)C[2*t+1]=5,C[2*t]=j(t,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,d,p)}(),q=!0),t.l_desc=new F(t.dyn_ltree,O),t.d_desc=new F(t.dyn_dtree,B),t.bl_desc=new F(t.bl_tree,R),t.bi_buf=0,t.bi_valid=0,W(t)},r._tr_stored_block=J,r._tr_flush_block=function(t,e,r,i){var n,s,a=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,r=4093624447;for(e=0;e<=31;e++,r>>>=1)if(1&r&&0!==t.dyn_ltree[2*e])return o;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return h;for(e=32;e<u;e++)if(0!==t.dyn_ltree[2*e])return h;return o}(t)),Y(t,t.l_desc),Y(t,t.d_desc),a=function(t){var e;for(X(t,t.dyn_ltree,t.l_desc.max_code),X(t,t.dyn_dtree,t.d_desc.max_code),Y(t,t.bl_desc),e=d-1;3<=e&&0===t.bl_tree[2*S[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),n=t.opt_len+3+7>>>3,(s=t.static_len+3+7>>>3)<=n&&(n=s)):n=s=r+5,r+4<=n&&-1!==e?J(t,e,r,i):4===t.strategy||s===n?(P(t,2+(i?1:0),3),K(t,z,C)):(P(t,4+(i?1:0),3),function(t,e,r,i){var n;for(P(t,e-257,5),P(t,r-1,5),P(t,i-4,4),n=0;n<i;n++)P(t,t.bl_tree[2*S[n]+1],3);V(t,t.dyn_ltree,e-1),V(t,t.dyn_dtree,r-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,a+1),K(t,t.dyn_ltree,t.dyn_dtree)),W(t),i&&M(t)},r._tr_tally=function(t,e,r){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&r,t.last_lit++,0===e?t.dyn_ltree[2*r]++:(t.matches++,e--,t.dyn_ltree[2*(A[r]+u+1)]++,t.dyn_dtree[2*N(e)]++),t.last_lit===t.lit_bufsize-1},r._tr_align=function(t){P(t,2,3),L(t,m,z),function(t){16===t.bi_valid?(U(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}(t)}},{"../utils/common":41}],53:[function(t,e,r){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(t,e,r){"use strict";e.exports="function"==typeof setImmediate?setImmediate:function(){var t=[].slice.apply(arguments);t.splice(1,0,0),setTimeout.apply(null,t)}},{}]},{},[10])(10)});
/*! pdfmake v0.1.69, @license MIT, @link http://pdfmake.org */
//# sourceMappingURL=pdfmake.min.js.map
this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = {
  "Roboto-Italic.ttf": "AAEAAAASAQAABAAgR0RFRrRCsIIAAjGsAAACYkdQT1P/GhLXAAI0EAAAXcxHU1VC64LkWQACkdwAABWQT1MvMpeCsVIAAAGoAAAAYGNtYXABd1geAAAbWAAAEkZjdnQgBLst2gAAMKAAAABSZnBnbXP3H6sAAC2gAAABvGdhc3AACAATAAIxoAAAAAxnbHlm8oCfSQAAOxQAAfIkaGRteDpbTGEAABZAAAAFGGhlYWT8pdJlAAABLAAAADZoaGVhDKYSnAAAAWQAAAAkaG10eDNk1vwAAAIIAAAUOGxvY2F8sflRAAAw9AAACh5tYXhwBz4DAgAAAYgAAAAgbmFtZeyjGUsAAi04AAAER3Bvc3T/YQBkAAIxgAAAACBwcmVwvaJduAAAL1wAAAFEAAEAAAACIxI2CQuMXw889QAZCAAAAAAAxPARLgAAAADVAVLf+jj91QlMCHMAAgAJAAIAAAAAAAAAAQAAB2z+DAAACRb6OP5sCUwIAAGzAAAAAAAAAAAAAAAABQ4AAQAABQ4AkAAWAFYABQABAAAAAAAOAAACAAIaAAYAAQADBG8BkAAFAAAFmgUzAAABHwWaBTMAAAPRAGYCAAAAAgAAAAAAAAAAAOAAAv9QACBbAAAAIAAAAABHT09HAAEAAP/9BgD+AABmB5oCACAAAZ8AAAAABDoFsAAgACAAAwOWAGQAAAAAAAAAAAH2AAAB9gAAAgkAQwKFAMgE0QBSBGYASgW5ALsE3QA6AWQAqgKxAG0Cvf+PA2IAawRwAEwBkP+PAi4AGQIVADUDPf+PBGYAaARmAPkEZgAXBGYANARmAAUEZgByBGYAcARmAJ0EZgBBBGYAlAHrACsBrv+bA/wAQQRMAHAEGAA6A7QApQcCAEQFGv+vBN8AOwUXAHQFIQA7BHMAOwRUADsFUwB5BZIAOwImAEkEUgAKBOcAOwQ3ADsG0AA7BZIAOwVgAHcE7wA7BWAAbwTRADoEpQAnBKsAqAUSAGcE+gCkBuwAwwTn/9QEswCoBK//6wIZ//8DOQC/Ahn/egNIAE8Div+BAnAA0ARDADMEZQAfBBoARgRqAEsEJgBFArwAdARlAAQEUAAfAewALwHk/xQD+QAgAewALwbXAB4EUgAfBHcARQRl/9cEcwBJAqoAHwQKAC4CkwBDBFEAWwPMAG4F3wCAA+P/xAO2/6UD4//tAqoAOAHuACECqv+MBVEAaQHu//EESABSBIz/8wWSABIEHQBDAeb/9wTM/90DSADaBiMAYgOCAMMDrgBZBFYAgQYkAGEDmAD3AvAA6AQvACUC4gBcAuIAbgJ5ANUEb//lA9UAewIQAKUB9v/IAuIA3gORAMADrQAPBbkAuQYPALQGEwCeA7b/0wdL/4QELQAoBWAAIASgADgEpwAeBpcAEwSWAFwEeABEBG8AOQSD/+AErABLBXkANQH1AC4EWwAtBDgAIgIiACMFagA1BG8AJAdwAFQHFgBHAfcAMwVnAFECrv9JBV4AZwR5AEIFbwBnBNcAWgH+/wkEIQA+A7EBFwN8AScDmQD3A1oBBwHsAQ4CogEBAiP/rwOzAN0C7wDCAlL/6QAA/WoAAP3rAAD9CwAA/fUAAPzbAAD8uwIHASED9gDzAhEApQRbAEMFg/+xBVEAaQUg/8QEeAAMBZMARAR4/9oFmQBVBWgAhgUzAAoEbABIBKP/8APtAIQEbwBDBDkAKQQPAIIEbwAkBHUAcwKNAIUEVv+3A9gAPwSpAGAEb//cBDYATgRvAEoEFgCHBEUAZwWCAEEFeQBPBm4AZgSHAFEEKwBnBiIAZgXbAKEFRQB4CFn/zAhsAEMGWgC0BZIAQgTuADQF4P+LBxX/rASlACUFkgBDBYj/ygTqAJMGBwBbBbYAQQVaAM4HVwBCB44AQgXtAIkGwABFBOgANgVFAHQG+gBJBPv/6ARUAEYEeQAwA0sALQS5/40F+/+lA/sAIQSFAC8EOwAvBIb/yAXLADAEhAAvBIUALwPEAGAFqgBMBKMALwRCAHsGUAAvBnUAJATbAFYGEAAwBEEAMAQ2ADQGXwAwBEz/vwRQAB8ENgBOBp//wwa5AC8EcAAfBIUALwbcAG8GBgBPBD8ALgb+AEkF1AAsBLf/ugQv/6IG3wBaBecATganACYFvgApCMkASAefAC4EDf/OA8f/ygVRAGkEcgBCBO0ArQPuAIQFUQBqBG8ARAbVAHQF/wBSBtwAbwYGAE8FFABmBDAATQThAEAAAPzoAAD9CwAA/hcAAP47AAD6OAAA+k8F5QBDBNEALwQ/AC4E/gA6BHD/1wRLADUDfwAkBMAAQwPwACQHcf+sBjr/pQV5AEQEngAvBOwANgRmAC0GZAC7BWMAdAXbADsEvgAvB50AOgWSACQH/ABCBskAJAXKAHEEuABfBPv/1AQU/8QG/wCsBT0AVwWaAM4EfQB7BU8AxARSAJgFTwAcBgoAigSjAAcE7AA1BEMALQXa/8oE0//IBZAAQwRvACQF7QA7BNAALwchADsGGAAwBWcAUQSOADwEjv/8BJ3/+AOZ/+kFEP/UBCn/xATaADEGawAyBrkATAYvAK0FDQBoBDIArwPyAKAHj//fBk3/2gfIADsGeAAjBNoAagQHAEwFiwCaBQMAfQVFAGoF3v/KBNb/yAMSAPID/wAAB/QAAAP/AAAH9AAAAq4AAAIEAAABXAAABGYAAAIpAAABnwAAAQIAAADVAAAAAAAAAi0AGQItABkFIgCnBhkAmQOT/14BlwCuAZcAiQGV/5gBlwDUAsgAtgLPAJUCtv+UBFEAdwR2//YCpwCgA7EAOQU7ADkBfQBSB3kAlwJeAF8CXgACA5H/7wLiAGMDUAB+BIz/8wYuAAoGaAA5CD8AOgXIAAkGBgAfBGYAUQW3AEMEDABJBFwACgUp//IFMP/lBcQAzAO7AEsIBQA1BOUA6gT6AIIGAQC1BqwAkgalAI8GQwC+BHYATQVtACQElf+sBHkAqwSqAEEIBQBNAgb/GgRpADEETABwA/z/1AQZABkD8wBBAkQAeAKFAHAB/v/jBNcAdARWAFgEcgB0BqoAdAaqAHQE0gB0BnIAKQAAAAAH/v+rCDUAXALi/+kC4gBrAuIAHQP6AGsD+gAoA/oAcAP5AEsD+gBKA/r/9wP6ABYD+v/9A/oAvAP6AEoEDf/cBBUAdAQ9/7YF8ACVBE8AegRkAEUEEABtBAoAEQQzAB0EoQBFBEUAHQShAEoExwAdBd4AHQOiAB0EPQAdA7z/9gHjACoExwAdBJIATAO4AB0ECgASBB0ABgOPABkDnQAdBE//sAShAEoET/+wA3j/0wSzAB0D2//VBUgAUQT6AH4E1gAMBVIAbARkAEcHE//EByEAHQVUAG0EsgAdBEIAHwUH/4kF5/+vBCgAEQTQAB8ENwAeBKb/xAQJAFgFCgAdBFIAWgYqAB0GgwAdBQAAUAXNAB8ENwAfBGMAIAZOAB0Ebv/fA/z/+gYh/68EYQAeBOwAHgUZAGkFoABQBEcAdASO/7YGOgBsBFIAWgRSAB0FoQAvBK8AQQQoABEEoQBKBB3//wPPAB4H7gAdBJH/3QLi//sC4v/wAuIAFgLiAB4C4gAvAuIACwLiADYDhACTAqoBCwPSAB0EJP+aBKgASwUtAEMFBwBEA/4AJQUfAEQD+gAlBGcAHQRkAEcEOQAdBGz/pQH4APwDkgERAAD9KgPbANID3wAiA/kAzgPgAM0DnQAdA40BEQOMARIC4gCQAuIAYwLiAIkC4gCRAuIAogLiAH4C4gCpBWEAgQWMAIQFcgBEBb0AhQXAAIUDwgC7BGkAOQRB/4EEtP/TBFP/1QQYACsDkgETAY//vQZ7AEkEnwA/Aff/DwRm/6wEZv/jBGb/uQRmAC0EZgBWBGYAJQRmAGoEZgAdBGYAQQRmAQwCAP8JAf//CQH2AC4B9v96AfYALgQ5AB0E5ABkBAoAYgRlAB8EHABDBHoARwRzACQEhQBBBHT/1wSDAEYEJgBFBGUANQNoAKkEuwArA6L/6AYT/5oD5AAdBKH/9ATHAB0ExwAdAfYAAAIuABkFPwARBT8AEQRuAD0EqwCoApP/9AUa/68FGv+vBRr/rwUa/68FGv+vBRr/rwUa/68FFwB0BHMAOwRzADsEcwA7BHMAOwImAEkCJgBJAiYASQImAEkFkgA7BWAAdwVgAHcFYAB3BWAAdwVgAHcFEgBnBRIAZwUSAGcFEgBnBLMAqARDADMEQwAzBEMAMwRDADMEQwAzBEMAMwRDADMEGgBGBCYARQQmAEUEJgBFBCYARQH1AC4B9QAuAfUALgH1AC4EUgAfBHcARQR3AEUEdwBFBHcARQR3AEUEUQBbBFEAWwRRAFsEUQBbA7b/pQO2/6UFGv+vBEMAMwUa/68EQwAzBRr/rwRDADMFFwB0BBoARgUXAHQEGgBGBRcAdAQaAEYFFwB0BBoARgUhADsFAABLBHMAOwQmAEUEcwA7BCYARQRzADsEJgBFBHMAOwQmAEUEcwA7BCYARQVTAHkEZQAEBVMAeQRlAAQFUwB5BGUABAVTAHkEZQAEBZIAOwRQAB8CJgBJAfUAEQImAEkB9QAuAiYASQH1AC4CJv+OAez/cAImAEkGeABJA9AALwRSAAoB/v8JBOcAOwP5ACAENwA7AewALwQ3ADsB7P+jBDcAOwKCAC8ENwA7AsgALwWSADsEUgAfBZIAOwRSAB8FkgA7BFIAHwRSAB8FYAB3BHcARQVgAHcEdwBFBWAAdwR3AEUE0QA6AqoAHwTRADoCqv+fBNEAOgKqAB8EpQAnBAoALgSlACcECgAuBKUAJwQKAC4EpQAnBAoALgSlACcECgAuBKsAqAKTAEMEqwCoApMAQwSrAKgCuwBDBRIAZwRRAFsFEgBnBFEAWwUSAGcEUQBbBRIAZwRRAFsFEgBnBFEAWwUSAGcEUQBbBuwAwwXfAIAEswCoA7b/pQSzAKgEr//rA+P/7QSv/+sD4//tBK//6wPj/+0HS/+EBpcAEwVgACAEbwA5BGf/sARn/7AEEABtBGz/pQRs/6UEbP+lBGz/pQRs/6UEbP+lBGz/pQRkAEcD0gAdA9IAHQPSAB0D0gAdAeMAKgHjACoB4wAqAeMAKgTHAB0EoQBKBKEASgShAEoEoQBKBKEASgRkAEUEZABFBGQARQRkAEUEFQB0BGz/pQRs/6UEbP+lBGQARwRkAEcEZABHBGQARwRnAB0D0gAdA9IAHQPSAB0D0gAdA9IAHQSSAEwEkgBMBJIATASSAEwExwAdAeMADwHjACoB4wAqAeP/egHjACoDvP/2BD0AHQOiAB0DogAdA6IAHQOiAB0ExwAdBMcAHQTHAB0EoQBKBKEASgShAEoEMwAdBDMAHQQzAB0ECgARBAoAEQQKABEECgARBBAAbQQQAG0EEABtBGQARQRkAEUEZABFBGQARQRkAEUEZABFBfAAlQQVAHQEFQB0BA3/3AQN/9wEDf/cBRr/rwRz/58Fkv+tAib/swV0AFYFF/+KBUcAHgKNACAFGv+vBN8AOwRzADsEr//rBZIAOwImAEkE5wA7BtAAOwWSADsFYAB3BO8AOwSrAKgEswCoBOf/1AImAEkEswCoBGwASAQ5ACkEbwAkAo0AhQRFAGcEWwAtBHcARQRv/+UDzABuA+P/xAKNAGYERQBnBHcARQRFAGcGbgBmBHMAOwRbAEMEpQAnAiYASQImAEkEUgAKBQcARATnADsE6gCTBRr/rwTfADsEWwBDBHMAOwWSAEMG0AA7BZIAOwVgAHcFkwBEBO8AOwUXAHQEqwCoBOf/1ARDADMEJgBFBIUALwR3AEUEZf/XBBoARgO2/6UD4//EBCYARQNLAC0ECgAuAewALwH1AC4B5P8UBDsALwO2/6UG7ADDBd8AgAbsAMMF3wCABuwAwwXfAIAEswCoA7b/pQFkAKoChQDIBBIAQwH+/wkBlwCJBtAAOwbXAB4FGv+vBEMAMwRzADsFkgBDBCYARQSFAC8FaACGBXkATwTtAK0D7gCECC0ARQkWAHcEpQAlA/sAIQUXAHQEGgBGBLMAqAPtAIQCJgBJBxX/rAX7/6UCJgBJBRr/rwRDADMFGv+vBEMAMwdL/4QGlwATBHMAOwQmAEUFZwBRBCEAPgQhAD4HFf+sBfv/pQSlACUD+wAhBZIAQwSFAC8FkgBDBIUALwVgAHcEdwBFBVEAaQRyAEIFUQBpBHIAQgVFAHQENgA0BOoAkwO2/6UE6gCTA7b/pQTqAJMDtv+lBVoAzgRCAHsGwABFBhAAMARqAEsFGv+vBEMAMwUa/68EQwAzBRr/rwRDADMFGv+vBEMAMwUa/68EQwAzBRr/rwRDADMFGv+vBEMAMwUa/68EQwAzBRr/rwRDADMFGv+vBEMAMwUa/68EQwAzBRr/rwRDADMEcwA7BCYARQRzADsEJgBFBHMAOwQmAEUEcwA7BCYARQRzADsEJgBFBHMAOwQmAEUEcwA7BCYARQRzADsEJgBFAiYASQH1AC4CJgAOAez/8QVgAHcEdwBFBWAAdwR3AEUFYAB3BHcARQVgAHcEdwBFBWAAdwR3AEUFYAB3BHcARQVgAHcEdwBFBV4AZwR5AEIFXgBnBHkAQgVeAGcEeQBCBV4AZwR5AEIFXgBnBHkAQgUSAGcEUQBbBRIAZwRRAFsFbwBnBNcAWgVvAGcE1wBaBW8AZwTXAFoFbwBnBNcAWgVvAGcE1wBaBLMAqAO2/6UEswCoA7b/pQSzAKgDtv+lBIgAAASrAKgDxABgBVoAzgRCAHsEWwBDA0sALQYKAIoEowAHBFAAHwToACsE6AArBFsAEANL/+YFGwBJBBIAKwSzAKgD7QBdBOf/1APj/8QEOQApBFT/1wYZAJkEZgAXBGYANARmAAUEZgByBHoAhASOAFUEegCUBI4AfAVTAHkEZQAEBZIAOwRSAB8FGv+vBEMAMwRzADsEJgBFAib/3wH1/40FYAB3BHcARQTRADoCqgAfBRIAZwRRAFsEj/9OBN8AOwRlAB8FIQA7BGoASwUhADsEagBLBZIAOwRQAB8E5wA7A/kAIATnADsD+QAgBDcAOwHs//IG0AA7BtcAHgWSADsEUgAfBWAAdwTvADsEZf/XBNEAOgKq/+4EpQAnBAoALgSrAKgCkwBDBRIAZwT6AKQDzABuBPoApAPMAG4G7ADDBd8AgASv/+sD4//tBab+xgRs/6UEDv+lBQP/wQIf/8UEqwATBFH/XwTgABYEbP+lBDkAHQPSAB0EDf/cBMcAHQHjACoEPQAdBd4AHQTHAB0EoQBKBEUAHQQQAG0EFQB0BD3/tgHjACoEFQB0A9IAHQOdAB0ECgARAeMAKgHjACoDvP/2BD0AHQQJAFgEbP+lBDkAHQOdAB0D0gAdBNAAHwXeAB0ExwAdBKEASgSzAB0ERQAdBGQARwQQAG0EPf+2BCgAEQTHAB0EZABIBBUAdAWhAC8E0AAfBAkAWAVIAFEFnwAqBhP/mgSh//QECgARBfAAlQXwAJUF8ACVBBUAdAUa/68EQwAzBHMAOwQmAEUEbP+lA9IAHQH1//EAAAABAAAFEAkKBAAAAgICAwUFBgUCAwMEBQICAgQFBQUFBQUFBQUFAgIEBQUECAYFBgYFBQYGAgUGBQgGBgYGBQUFBgYIBgUFAgQCBAQDBQUFBQUDBQUCAgQCCAUFBQUDBQMFBAcEBAQDAgMGAgUFBgUCBQQHBAQFBwQDBQMDAwUEAgIDBAQGBwcECAUGBQUHBQUFBQUGAgUFAgYFCAgCBgMGBQYFAgUEBAQEAgMCBAMDAAAAAAAAAgQCBQYGBgUGBQYGBgUFBAUFBQUFAwUEBQUFBQUFBgYHBQUHBwYJCQcGBgcIBQYGBgcGBggJBwgGBggGBQUEBQcEBQUFBwUFBAYFBQcHBQcFBQcFBQUHCAUFCAcFCAcFBQgHBwYKCQUEBgUGBAYFCAcIBwYFBQAAAAAAAAcFBQYFBQQFBAgHBgUGBQcGBwUJBgkIBwUGBQgGBgUGBQYHBQYFBwUGBQcFCAcGBQUFBAYFBQcIBwYFBAkHCQcFBQYGBgcFAwUJBQkDAgIFAgIBAQACAgYHBAICAgIDAwMFBQMEBgIIAwMEAwQFBwcJBwcFBgUFBgYGBAkGBgcIBwcFBgUFBQkCBQUEBQQDAwIFBQUICAUHAAkJAwMDBAQEBAQEBAQEBAUFBQcFBQUFBQUFBQUHBAUEAgUFBAUFBAQFBQUEBQQGBgUGBQgIBgUFBgcFBQUFBQYFBwcGBwUFBwUEBwUGBgYFBQcFBQYFBQUFBAkFAwMDAwMDAwQDBAUFBgYEBgQFBQUFAgQABAQEBAQEBAMDAwMDAwMGBgYGBgQFBQUFBQQCBwUCBQUFBQUFBQUFBQICAgICBQYFBQUFBQUFBQUFBAUEBwQFBQUCAgYGBQUDBgYGBgYGBgYFBQUFAgICAgYGBgYGBgYGBgYFBQUFBQUFBQUFBQUFAgICAgUFBQUFBQUFBQUEBAYFBgUGBQYFBgUGBQYFBgYFBQUFBQUFBQUFBgUGBQYFBgUGBQICAgICAgICAgcEBQIGBAUCBQIFAwUDBgUGBQYFBQYFBgUGBQUDBQMFAwUFBQUFBQUFBQUFAwUDBQMGBQYFBgUGBQYFBgUIBwUEBQUEBQQFBAgHBgUFBQUFBQUFBQUFBQQEBAQCAgICBQUFBQUFBQUFBQUFBQUFBQUFBQQEBAQEBQUFBQUCAgICAgQFBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUHBQUFBQUGBQYCBgYGAwYFBQUGAgYIBgYGBQUGAgUFBQUDBQUFBQQEAwUFBQcFBQUCAgUGBgYGBQUFBggGBgYGBgUGBQUFBQUFBAQFBAUCAgIFBAgHCAcIBwUEAgMFAgIICAYFBQYFBQYGBgQJCgUEBgUFBAIIBwIGBQYFCAcFBQYFBQgHBQQGBQYFBgUGBQYFBgUGBAYEBgQGBQgHBQYFBgUGBQYFBgUGBQYFBgUGBQYFBgUGBQUFBQUFBQUFBQUFBQUFBQUCAgICBgUGBQYFBgUGBQYFBgUGBQYFBgUGBQYFBgUGBQYFBgUGBQYFBgUFBAUEBQQFBQQGBQUEBwUFBgYFBAYFBQQGBAUFBwUFBQUFBQUFBgUGBQYFBQUCAgYFBQMGBQUFBQYFBgUGBQYEBgQFAggIBgUGBgUFAwUFBQMGBgQGBAgHBQQGBQUGAgUFBQUFBAUFAgUHBQUFBQUFAgUEBAUCAgQFBQUFBAQFBwUFBQUFBQUFBQUFBgUFBgYHBQUHBwcFBgUFBQUEAgAAAAMAAAADAAAAHAADAAEAAAAcAAMACgAABooABAZuAAAA9ACAAAYAdAAAAAIADQB+AKAArACtAL8AxgDPAOYA7wD+AQ8BEQElAScBMAFTAV8BZwF+AX8BjwGSAaEBsAHwAf8CGwI3AlkCvALHAskC3QLzAwEDAwMJAw8DIwOKA4wDkgOhA7ADuQPJA84D0gPWBCUELwRFBE8EYgRvBHkEhgSfBKkEsQS6BM4E1wThBPUFAQUQBRMeAR4/HoUe8R7zHvkfTSAJ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WLAFLxuxBR0+WbAM3LAg0DAx//8AM//oBN4GtQImAEUAAAEGAjll5gAWALAARViwGC8bsRgZPlmwL9ywM9AwMf///68AAASLB9kCJgAlAAABBwI6AO8BBgAWALAARViwBC8bsQQdPlmwDtywFdAwMf//ADP/6AP3BqQCJgBFAAABBgI6YdEAFgCwAEVYsBgvG7EYGT5ZsC3csDbQMDH///+v/p8Eiwc2AiYAJQAAACcAngD5ATYBBwCtBNwAAAATALAARViwBC8bsQQdPlmwENwwMQD//wAz/p8DzwYAAiYARQAAACYAnmsAAQcArQQpAAAAEwCwAEVYsBgvG7EYGT5ZsDHcMDEA////rwAABIsHtwImACUAAAEHAjwBFwEtAAwAsAQvsA7csBrQMDH//wAz/+gD5QaCAiYARQAAAQcCPACJ//gADACwGC+wL9ywO9AwMf///68AAASLB7cCJgAlAAABBwI1ARcBLQAMALAEL7AO3LAa0DAx//8AM//oA+UGggImAEUAAAEHAjUAif/4AAwAsBgvsC/csDvQMDH///+vAAAEiwhAAiYAJQAAAQcCPQEeAT0ADACwBC+wDtywF9AwMf//ADP/6APVBwoCJgBFAAABBwI9AJAABwAMALAYL7Av3LA40DAx////rwAABJIIFAImACUAAAEHAlABHwFFAAwAsAQvsA7csBfQMDH//wAz/+gEBAbeAiYARQAAAQcCUACRAA8ADACwGC+wL9ywONAwMf///6/+nwSLBw8CJgAlAAAAJwChAS4BNwEHAK0E3AAAABMAsABFWLAELxuxBB0+WbAO3DAxAP//ADP+nwPsBdkCJgBFAAAAJwChAKAAAQEHAK0EKQAAABMAsABFWLAYLxuxGBk+WbAv3DAxAP//ADv+qQSxBbACJgApAAAABwCtBJ0ACv//AEX+nwPgBFECJgBJAAAABwCtBHQAAP//ADsAAASxB8UCJgApAAABBwCrBM8BUgAJALAGL7AZ3DAxAP//AEX/6gPgBoMCJgBJAAABBwCrBFgAEAAJALAIL7At3DAxAP//ADsAAASxBy0CJgApAAABBwClAM8BRgAJALAGL7AW3DAxAP//AEX/6gQGBesCJgBJAAABBgClWAQACQCwCC+wKtwwMQD//wA7AAAFuwfPAiYAKQAAAQcCNwDAAToAFgCwAEVYsAYv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//8Aef/qBQYHVwImACsAAAEHAHUB9wFXABMAsABFWLAMLxuxDB0+WbAk3DAxAP//AAT+TwQoBgACJgBLAAABBwB1AU0AAAATALAARViwBC8bsQQZPlmwLNwwMQD//wA7AAAFdwc2AiYAMgAAAQcARAGdATYAEwCwAEVYsAYvG7EGHT5ZsAvcMDEA//8AHwAAA+MGAAImAFIAAAEHAEQA0gAAABMAsABFWLADLxuxAxk+WbAU3DAxAP///68AAASLByACJgAlAAABBwCsBIABMgAWALAARViwBC8bsQQdPlmwDNywENAwMf//ADP/6APPBesCJgBFAAABBwCsA/L//QAWALAARViwGC8bsRgZPlmwLdywMdAwMf//ADsAAASxBywCJgApAAABBwCsBE4BPgAWALAARViwBi8bsQYdPlmwDdywEdAwMf//AEX/6gPgBesCJgBJAAABBwCsA9f//QAWALAARViwCC8bsQgZPlmwIdywJdAwMf///98AAAKKBywCJgAtAAABBwCsAwQBPgAWALAARViwAi8bsQIdPlmwBdywCdAwMf///40AAAI4BekCJgCNAAABBwCsArL/+wAWALAARViwAi8bsQIZPlmwBdywCdAwMf//AHf/5wUNByICJgAzAAABBwCsBKEBNAAWALAARViwCi8bsQodPlmwJNywKNAwMf//AEX/6AQfBesCJgBTAAABBwCsA+D//QAWALAARViwAC8bsQAZPlmwJNywKNAwMf//ADoAAATCByACJgA2AAABBwCsBEMBMgAWALAARViwBC8bsQQdPlmwGdywHdAwMf//AB8AAALUBesCJgBWAAABBwCsA0n//QAWALAARViwCi8bsQoZPlmwEtywDdAwMf//AGf/5wUgByACJgA5AAABBwCsBHsBMgAWALAARViwCi8bsQodPlmwFNywGNAwMf//AFv/6AQeBesCJgBZAAABBwCsA+T//QAWALAARViwBy8bsQcZPlmwFdywGdAwMf///04AAAU8Bj8AJgDQZAAABwCu/i0AAP//ADv+qQSgBbACJgAmAAAABwCtBJgACv//AB/+lgP+BgACJgBGAAAABwCtBIb/9///ADv+qQTVBbACJgAoAAAABwCtBJcACv//AEv+nwR1BgACJgBIAAAABwCtBJkAAP//ADv+CQTVBbACJgAoAAABBwG6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AHAAqgAmABMAsABFWLAILxuxCBs+WbAL3DAxAP//AFj/6ARUBcsCJgIBAAABBgBwSiYAEwCwAEVYsBEvG7ERGz5ZsBPcMDEA//8AUQAABPMEjQIGAfEAAP//ACr/6wV+BI0AJgHjAAAABwHiAeMAAP///5oAAAX/BgACJgJzAAAABwB1ApUAAP////T/xwSiBh4CJgJ1AAAABwB1AYIAHv//ABH9/wPtBJ0CJgHZAAAABwG6AOP+oP//AJUAAAYpBh4CJgHVAAAABwBEAacAHv//AJUAAAYpBh4CJgHVAAAABwB1AjEAHv//AJUAAAYpBeUCJgHVAAAABwBqAXEAHv//AHQAAARlBh4CJgHTAAAABwBEALAAHv///6/+TwSLBbACJgAlAAAABwCkAWcAAP//ADP+TwPPBFECJgBFAAAABwCkALQAAP//ADv+WQSxBbACJgApAAAABwCkASgACv//AEX+TwPgBFECJgBJAAAABwCkAP8AAP///6X+TwPjBI0CJgIzAAAABwCkAQwAAP//AB3+VwPvBI0CJgIoAAAABwCkANgACP////H+qQGfBDoCJgCNAAAABwCtAzYACgAAABoBPgABAAAAAAAAAC8AAAABAAAAAAABAAYALwABAAAAAAACAAYANQABAAAAAAADAA0AOwABAAAAAAAEAA0AOwABAAAAAAAFABMASAABAAAAAAAGAA0AWwABAAAAAAAHACAAaAABAAAAAAAJAAYAiAABAAAAAAALAAoAjgABAAAAAAAMABMAmAABAAAAAAANAC4AqwABAAAAAAAOACoA2QADAAEECQAAAF4BAwADAAEECQABAAwBYQADAAEECQACAAwBbQADAAEECQADABoBeQADAAEECQAEABoBeQADAAEECQAFACYBkwADAAEECQAGABoBuQADAAEECQAHAEAB0wADAAEECQAJAAwCEwADAAEECQALABQCHwADAAEECQAMACYCMwADAAEECQANAFwCWQADAAEECQAOAFQCtUNvcHlyaWdodCAyMDExIEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuUm9ib3RvSXRhbGljUm9ib3RvIEl0YWxpY1ZlcnNpb24gMi4xMzc7IDIwMTdSb2JvdG8tSXRhbGljUm9ib3RvIGlzIGEgdHJhZGVtYXJrIG9mIEdvb2ds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A48DkAORA5IDkwOUA5UDlgOXA5gDmQOaA5sDnAOdA60DrgOvA7ADsQOyA7MDtAO1A7YDtwO4A7kDugO7A7wDvQO+A78DwAPBA8ID0wPVA9cD2QPuA/AD8gQHBA0EEwR9BIIEhgUHBQkAAgAAAAIACjoYAAED8gAEAAAB9AfONMY0xgf8CF42/jeuNMw5zDd6CGQ4GDgYN7g4AjgYOBg5zDhEDAIM0DiKOVg5lDTeNoQ5sg1GN1w4ZjWMDYw4Og7CODo4OjeIOGY4fA/EOXYQJjU8OXYQQDhmOcwQhjXGNv45zDb+EQgSBhMIE+oUjDl2FJIUnDg6F4YZeBpqG3AbhhuMG5IejB6SHswfAh+MNaA1oCG+OBgiYCNeNN4lwDgYOBg1QjgYOBg4GCaWNaA4GDWgKEApBimYKfoq4DWWK241PDNGK5gtcjhmMQAxOjMkMyQ4ZjJwMvozJDMkMyQ2/jeIOVg5djNGOGY1xjWWNN41PDe4N7g3uDgYNN41PDgYOBg5zDWWNN41PDTGM3A0xjTGNMY6CDQSNGA6AjS8Oeo58DoCOfA56jnqOeo56jSuOfA0zDnMOcw5zDnMOIo2/jb+Nv42/jb+Nv42/jTMN3o3ejd6N3o4GDgYOBg4GDgYOcw5zDnMOcw5zDaEN1w3XDdcN1w3XDdcN1w1jDWMNYw1jDg6N4g3iDeIN4g3iDl2OXY2/jdcNv43XDb+N1w0zDTMNMw0zDnMN3o1jDd6NYw3ejWMN3o1jDd6NYw4GDg6OBg4GDgYOBg4GDe4OAI4AjgCOAI4GDg6OBg4OjgYODo4OjnMN4g5zDeIOcw3iDh8OHw4fDiKOIo4ijmUNoQ5djaEObI5sjmyOgI6AjoIOfA58DnwOfA58DnwOfA6AjoCOgI6AjoCOfA58DnwOgI56jS8NLw0vDS8OgI6AjoCOgg2/jd6OBg4GDnMNoQ2/jeuN3o5sjgYOBg3uDgYOBg5zDhEOIo2hDTeOBg2hDg6N4g5djeIN3o1xjgYOBg3uDe4NUI2/jeuNcY3ejgYOBg5zDhENMw4ijTeN1w1jDeIOGY5djU8NYw1ljl2OZQ5lDmUNoQ5djTGNMY0xjgYODo2/jdcN3o1jDlYOXY0zDaEOXY4GDTeNTw4GDb+N1w2/jdcN3o1jDWMNYw03jU8Ocw3iDeIOGY1Qjl2NUI5djVCOXY2/jdcNv43XDb+N1w2/jdcNv43XDb+N1w2/jdcNv43XDb+N1w2/jdcNv43XDb+N1w3ejWMN3o1jDd6NYw3ejWMN3o1jDd6NYw3ejWMN3o1jDgYOBg5zDeIOcw3iDnMN4g5zDeIOcw3iDnMN4g5zDeIN4g2hDl2NoQ5djaEOXY4ijXGNZY4OjWgNcY3uDaEOBg4Ojb+N1w3ejgYOcw3iDh8N644ZjnMOcw4GDg6N7g3uDgCOBg4OjgYODo5zDhEOGY4fDiKOVg5djlYOXY5lDmyOcw58DoCOfA56joIOeo58DoCOggAAgCkAAQABAAAAAYABgABAAsADAACABMAEwAEACUAKgAFACwALQALAC8ANgANADgAOAAVADoAPwAWAEUARgAcAEkASgAeAEwATAAgAE8ATwAhAFEAVAAiAFYAVgAmAFgAWAAnAFoAXQAoAF8AXwAsAIoAigAtAJYAlgAuAJ0AnQAvALEAtQAwALcAuQA1ALsAuwA4AL0AvgA5AMAAwQA7AMMAxQA9AMcAzgBAANIA0gBIANQA3gBJAOAA7wBUAPEA8QBkAPYA+ABlAPsA/ABoAP4BAABqAQMBBQBtAQoBCgBwAQ0BDQBxARgBGgByASIBIgB1AS4BMAB2ATMBNQB5ATcBNwB8ATkBOQB9ATsBOwB+AUMBRAB/AVQBVACBAVYBVgCCAVgBWACDAVwBXgCEAYQBhQCHAYcBiQCJAdgB2ACMAdoB2wCNAd0B3QCPAeAB4QCQAesB7QCSAf8B/wCVAg4CEACWAjACMACZAjMCMwCaAkUCRQCbAkcCSACcAnoCewCeAn0CfQCgAn8ClAChApkCoAC3AqICpQC/AqoCrwDDArQCvADJAr4CvgDSAsACwADTAsICwgDUAsQCxADVAsYCzwDWAtgC2gDgAtwC3ADjAt4C3gDkAuAC4ADlAuIC4gDmAucC5wDnAukC6QDoAusC6wDpAu0C7QDqAu8C7wDrAvEC/QDsAv8C/wD5AwEDAQD6AwMDAwD7Aw4DDgD8AxADEAD9AxIDEgD+AyADIAD/AyIDJQEAAycDJwEEAykDKQEFAy8DOAEGA0MDRwEQA00DTwEVA1QDVAEYA2UDaQEZA20DbwEeA3gDeAEhA4YDiwEiA44DnQEoA6ADoAE4A6QDpAE5A6YDpgE6A6oDqgE7A60DrgE8A7ADsQE+A7MDuQFAA7sDvQFHA78DxAFKA8YDxwFQA8kDzAFSA9ID0wFWA9UD1QFYA9cD1wFZA9kD3AFaA98D5AFeA+YD5gFkA+oD6wFlA/AD8AFnA/ID+wFoA/4D/wFyBAEEBAF0BAsEDAF4BBAEEAF6BBIEGAF7BB4ERgGCBEgESAGrBEoEVwGsBF8EXwG6BHAEdQG7BHcEdwHBBHsEfAHCBH8EfwHEBIEEggHFBIQEhAHHBIYEhgHIBJcEmwHJBJ0EnQHOBJ8EoAHPBKIEogHRBKYEqAHSBKoEqgHVBKwErgHWBLAEsAHZBLIEsgHaBLQEugHbBLwEvAHiBL8EvwHjBMIExgHkBMgEyAHpBMoEywHqBM8EzwHsBNIE0gHtBNgE2AHuBN0E3QHvBOgE6AHwBOoE6gHxBPEE8QHyBPUE9QHzAAsAOP/YANL/2ADW/9gBOf/YAUX/2AMO/9gDEP/YAxL/2APB/9gEd//YBL//2AAYADoAFAA7ABIAPQAWARkAFAKZABYDIAASAyIAFgMkABYDiwAWA5oAFgOdABYD0wASA9UAEgPXABID2QAWA+oAFAPyABYEcAAWBHIAFgR0ABYEhgAWBMIAFATEABQExgASAAEAE/8gAOcAEP8WABL/FgAl/1YALv74ADgAFABF/94AR//rAEj/6wBJ/+sAS//rAFP/6wBV/+sAVv/mAFn/6gBa/+gAXf/oAJT/6wCZ/+sAm//qALL/VgC0/1YAu//rAL3/6ADI/+sAyf/rAMv/6gDSABQA1gAUAPf/6wED/+sBDf9WARj/6wEa/+gBHv/rASL/6wE5ABQBQv/rAUUAFAFg/+sBYf/rAWv/6wGG/xYBiv8WAY7/FgGP/xYB6//AAe3/wAIz/8ACf/9WAoD/VgKB/1YCgv9WAoP/VgKE/1YChf9WApr/3gKb/94CnP/eAp3/3gKe/94Cn//eAqD/3gKh/+sCov/rAqP/6wKk/+sCpf/rAqv/6wKs/+sCrf/rAq7/6wKv/+sCsP/qArH/6gKy/+oCs//qArT/6AK1/+gCtv9WArf/3gK4/1YCuf/eArr/VgK7/94Cvf/rAr//6wLB/+sCw//rAsX/6wLH/+sCyf/rAsv/6wLN/+sCz//rAtH/6wLT/+sC1f/rAtf/6wLl/vgC+f/rAvv/6wL9/+sDDgAUAxAAFAMSABQDFf/qAxf/6gMZ/+oDG//qAx3/6gMf/+oDI//oAzL/wAMz/8ADNP/AAzX/wAM2/8ADN//AAzj/wANN/8ADTv/AA0//wAOG/1YDjv9WA57/6wOi/+oDpP/rA6b/6AOp/+oDqv/rA6v/6gOy/vgDtv9WA8EAFAPD/94DxP/rA8b/6wPI/+sDyf/oA8v/6wPS/+gD2v/oA+L/VgPj/94D5v/rA+v/6APs/+sD8f/rA/P/6AP4/1YD+f/eA/r/VgP7/94D///rBAH/6wQC/+sEDP/rBA7/6wQQ/+sEFP/oBBb/6AQY/+gEHf/rBB7/VgQf/94EIP9WBCH/3gQi/1YEI//eBCT/VgQl/94EJv9WBCf/3gQo/1YEKf/eBCr/VgQr/94ELP9WBC3/3gQu/1YEL//eBDD/VgQx/94EMv9WBDP/3gQ0/1YENf/eBDf/6wQ5/+sEO//rBD3/6wQ//+sEQf/rBEP/6wRF/+sES//rBE3/6wRP/+sEUf/rBFP/6wRV/+sEV//rBFn/6wRb/+sEXf/rBF//6wRh/+sEY//qBGX/6gRn/+oEaf/qBGv/6gRt/+oEb//qBHH/6ARz/+gEdf/oBHcAFASZ/1YEmv/eBJz/6wSg/+sEpP/qBKn/6wSr/+sEvwAUBMP/6ATF/+gEy//ABNL/wATq/8AAMwA4/9UAOv/kADv/7AA9/90A0v/VANb/1QEZ/+QBOf/VAUX/1QHrAA4B7QAOAjMADgKZ/90DDv/VAxD/1QMS/9UDIP/sAyL/3QMk/90DMgAOAzMADgM0AA4DNQAOAzYADgM3AA4DOAAOA00ADgNOAA4DTwAOA4v/3QOa/90Dnf/dA8H/1QPT/+wD1f/sA9f/7APZ/90D6v/kA/L/3QRw/90Ecv/dBHT/3QR3/9UEhv/dBL//1QTC/+QExP/kBMb/7ATLAA4E0gAOBOoADgAdADj/sAA6/+0APf/QANL/sADW/7ABGf/tATn/sAFF/7ACmf/QAw7/sAMQ/7ADEv+wAyL/0AMk/9ADi//QA5r/0AOd/9ADwf+wA9n/0APq/+0D8v/QBHD/0ARy/9AEdP/QBHf/sASG/9AEv/+wBML/7QTE/+0AEQAu/+4AOf/uApX/7gKW/+4Cl//uApj/7gLl/+4DFP/uAxb/7gMY/+4DGv/uAxz/7gMe/+4Dsv/uBGL/7gRk/+4Ewf/uAE0ABgAQAAsAEAANABQAQQASAEf/6ABI/+gASf/oAEv/6ABV/+gAYQATAJT/6ACZ/+gAu//oAMj/6ADJ/+gA9//oAQP/6AEe/+gBIv/oAUL/6AFg/+gBYf/oAWv/6AGEABABhQAQAYcAEAGIABABiQAQAqH/6AKi/+gCo//oAqT/6AKl/+gCvf/oAr//6ALB/+gCw//oAsX/6ALH/+gCyf/oAsv/6ALN/+gCz//oAtH/6ALT/+gC1f/oAtf/6AOe/+gDxP/oA8j/6APL/+gD2wAQA9wAEAPfABAD5v/oA+z/6APx/+gD///oBAH/6AQC/+gEDv/oBB3/6AQ3/+gEOf/oBDv/6AQ9/+gEP//oBEH/6ARD/+gERf/oBFn/6ARb/+gEXf/oBGH/6ASc/+gEqf/oBKv/6ABAAEf/7ABI/+wASf/sAEv/7ABV/+wAlP/sAJn/7AC7/+wAyP/sAMn/7AD3/+wBA//sAR7/7AEi/+wBQv/sAWD/7AFh/+wBa//sAqH/7AKi/+wCo//sAqT/7AKl/+wCvf/sAr//7ALB/+wCw//sAsX/7ALH/+wCyf/sAsv/7ALN/+wCz//sAtH/7ALT/+wC1f/sAtf/7AOe/+wDxP/sA8j/7APL/+wD5v/sA+z/7APx/+wD///sBAH/7AQC/+wEDv/sBB3/7AQ3/+wEOf/sBDv/7AQ9/+wEP//sBEH/7ARD/+wERf/sBFn/7ARb/+wEXf/sBGH/7ASc/+wEqf/sBKv/7AAYAFP/7AEY/+wCq//sAqz/7AKt/+wCrv/sAq//7AL5/+wC+//sAv3/7AOk/+wDqv/sA8b/7AQM/+wEEP/sBEv/7ARN/+wET//sBFH/7ART/+wEVf/sBFf/7ARf/+wEoP/sAAYAEP+EABL/hAGG/4QBiv+EAY7/hAGP/4QAEQAu/+wAOf/sApX/7AKW/+wCl//sApj/7ALl/+wDFP/sAxb/7AMY/+wDGv/sAxz/7AMe/+wDsv/sBGL/7ARk/+wEwf/sACAABv/yAAv/8gBa//MAXf/zAL3/8wD2//UBGv/zAYT/8gGF//IBh//yAYj/8gGJ//ICtP/zArX/8wMj//MDpv/zA8n/8wPS//MD2v/zA9v/8gPc//ID3//yA+v/8wPz//MEFP/zBBb/8wQY//MEcf/zBHP/8wR1//MEw//zBMX/8wA/ACf/8wAr//MAM//zADX/8wCD//MAk//zAJj/8wCz//MAxAANANP/8wEI//MBF//zARv/8wEd//MBH//zASH/8wFB//MBav/zAkX/8wJG//MCSP/zAkn/8wKG//MCkP/zApH/8wKS//MCk//zApT/8wK8//MCvv/zAsD/8wLC//MC0P/zAtL/8wLU//MC1v/zAvj/8wL6//MC/P/zAy3/8wOK//MDl//zA73/8wPA//MD7f/zA/D/8wQL//MEDf/zBA//8wRK//METP/zBE7/8wRQ//MEUv/zBFT/8wRW//MEWP/zBFr/8wRc//MEXv/zBGD/8wSf//MEuP/zAEAAJ//mACv/5gAz/+YANf/mAIP/5gCT/+YAmP/mALP/5gC4/8IAxAAQANP/5gEI/+YBF//mARv/5gEd/+YBH//mASH/5gFB/+YBav/mAkX/5gJG/+YCSP/mAkn/5gKG/+YCkP/mApH/5gKS/+YCk//mApT/5gK8/+YCvv/mAsD/5gLC/+YC0P/mAtL/5gLU/+YC1v/mAvj/5gL6/+YC/P/mAy3/5gOK/+YDl//mA73/5gPA/+YD7f/mA/D/5gQL/+YEDf/mBA//5gRK/+YETP/mBE7/5gRQ/+YEUv/mBFT/5gRW/+YEWP/mBFr/5gRc/+YEXv/mBGD/5gSf/+YEuP/mADgAJf/kADz/0gA9/9MAsv/kALT/5ADE/+IA2v/SAQ3/5AEz/9IBQ//SAV3/0gJ//+QCgP/kAoH/5AKC/+QCg//kAoT/5AKF/+QCmf/TArb/5AK4/+QCuv/kAyL/0wMk/9MDhv/kA4v/0wOO/+QDmv/TA5v/0gOd/9MDtv/kA8L/0gPZ/9MD4v/kA/L/0wP1/9ID+P/kA/r/5AQD/9IEHv/kBCD/5AQi/+QEJP/kBCb/5AQo/+QEKv/kBCz/5AQu/+QEMP/kBDL/5AQ0/+QEcP/TBHL/0wR0/9MEhv/TBJn/5AAoABD/HgAS/x4AJf/NALL/zQC0/80Ax//yAQ3/zQGG/x4Biv8eAY7/HgGP/x4Cf//NAoD/zQKB/80Cgv/NAoP/zQKE/80Chf/NArb/zQK4/80Cuv/NA4b/zQOO/80Dtv/NA+L/zQP4/80D+v/NBB7/zQQg/80EIv/NBCT/zQQm/80EKP/NBCr/zQQs/80ELv/NBDD/zQQy/80ENP/NBJn/zQABAMQADgACAMr/7QD2/8AAugBH/9wASP/cAEn/3ABL/9wAUf/zAFL/8wBT/9YAVP/zAFX/3ABZ/90AWv/hAF3/4QCU/9wAmf/cAJv/3QC7/9wAvf/hAL7/7gC//+YAwf/zAML/6wDD/+kAxf/wAMb/5wDI/9wAyf/cAMr/4wDL/90AzP/OAM3/1ADO/9sA7P/zAPD/8wDx//MA8//zAPT/8wD1//MA9//cAPj/8wD6//MA+//zAP7/8wEA//MBA//cAQX/8wEY/9YBGv/hAR7/3AEi/9wBK//zATb/8wE8//MBPv/zAUL/3AFT//MBVf/zAVf/8wFc//MBYP/cAWH/3AFr/9wCof/cAqL/3AKj/9wCpP/cAqX/3AKq//MCq//WAqz/1gKt/9YCrv/WAq//1gKw/90Csf/dArL/3QKz/90CtP/hArX/4QK9/9wCv//cAsH/3ALD/9wCxf/cAsf/3ALJ/9wCy//cAs3/3ALP/9wC0f/cAtP/3ALV/9wC1//cAvL/8wL0//MC9v/zAvf/8wL5/9YC+//WAv3/1gMV/90DF//dAxn/3QMb/90DHf/dAx//3QMj/+EDnv/cA6D/8wOi/90DpP/WA6b/4QOp/90Dqv/WA6v/3QPE/9wDxf/zA8b/1gPH//MDyP/cA8n/4QPL/9wDzP/zA9H/8wPS/+ED2v/hA+H/8wPm/9wD5//zA+v/4QPs/9wD8f/cA/P/4QP//9wEAf/cBAL/3AQI//MECv/zBAz/1gQO/9wEEP/WBBT/4QQW/+EEGP/hBBz/8wQd/9wEN//cBDn/3AQ7/9wEPf/cBD//3ARB/9wEQ//cBEX/3ARL/9YETf/WBE//1gRR/9YEU//WBFX/1gRX/9YEWf/cBFv/3ARd/9wEX//WBGH/3ARj/90EZf/dBGf/3QRp/90Ea//dBG3/3QRv/90Ecf/hBHP/4QR1/+EEfP/zBJj/8wSc/9wEoP/WBKT/3QSp/9wEq//cBLX/8wS3//MEw//hBMX/4QB8AAb/2gAL/9oAR//wAEj/8ABJ//AAS//wAFX/8ABZ/+8AWv/cAF3/3ACU//AAmf/wAJv/7wC7//AAvf/cAML/7ADEAA8Axv/qAMj/8ADJ//AAyv/EAMv/7wDM/+cA9//wAQP/8AEa/9wBHv/wASL/8AFC//ABYP/wAWH/8AFr//ABhP/aAYX/2gGH/9oBiP/aAYn/2gKh//ACov/wAqP/8AKk//ACpf/wArD/7wKx/+8Csv/vArP/7wK0/9wCtf/cAr3/8AK///ACwf/wAsP/8ALF//ACx//wAsn/8ALL//ACzf/wAs//8ALR//AC0//wAtX/8ALX//ADFf/vAxf/7wMZ/+8DG//vAx3/7wMf/+8DI//cA57/8AOi/+8Dpv/cA6n/7wOr/+8DxP/wA8j/8APJ/9wDy//wA9L/3APa/9wD2//aA9z/2gPf/9oD5v/wA+v/3APs//AD8f/wA/P/3AP///AEAf/wBAL/8AQO//AEFP/cBBb/3AQY/9wEHf/wBDf/8AQ5//AEO//wBD3/8AQ///AEQf/wBEP/8ARF//AEWf/wBFv/8ARd//AEYf/wBGP/7wRl/+8EZ//vBGn/7wRr/+8Ebf/vBG//7wRx/9wEc//cBHX/3ASc//AEpP/vBKn/8ASr//AEw//cBMX/3AA8AAb/oAAL/6AASv/pAFn/8QBa/8UAXf/FAJv/8QC9/8UAwv/uAMQAEADG/+wAyv8gAMv/8QEa/8UBhP+gAYX/oAGH/6ABiP+gAYn/oAKw//ECsf/xArL/8QKz//ECtP/FArX/xQMV//EDF//xAxn/8QMb//EDHf/xAx//8QMj/8UDov/xA6b/xQOp//EDq//xA8n/xQPS/8UD2v/FA9v/oAPc/6AD3/+gA+v/xQPz/8UEFP/FBBb/xQQY/8UEY//xBGX/8QRn//EEaf/xBGv/8QRt//EEb//xBHH/xQRz/8UEdf/FBKT/8QTD/8UExf/FAEEAR//nAEj/5wBJ/+cAS//nAFX/5wCU/+cAmf/nALv/5wDEAA8AyP/nAMn/5wD3/+cBA//nAR7/5wEi/+cBQv/nAWD/5wFh/+cBa//nAqH/5wKi/+cCo//nAqT/5wKl/+cCvf/nAr//5wLB/+cCw//nAsX/5wLH/+cCyf/nAsv/5wLN/+cCz//nAtH/5wLT/+cC1f/nAtf/5wOe/+cDxP/nA8j/5wPL/+cD5v/nA+z/5wPx/+cD///nBAH/5wQC/+cEDv/nBB3/5wQ3/+cEOf/nBDv/5wQ9/+cEP//nBEH/5wRD/+cERf/nBFn/5wRb/+cEXf/nBGH/5wSc/+cEqf/nBKv/5wAFAMr/6gDt/+4A9v+rATr/7AFt/+wAAQD2/9UAAQDKAAsAvgAGAAwACwAMAEf/6ABI/+gASf/oAEoADABL/+gAU//qAFX/6ABaAAsAXQALAJT/6ACZ/+gAu//oAL0ACwC+/+0AxgALAMj/6ADJ/+gAygAMAPf/6AED/+gBGP/qARoACwEe/+gBIv/oAUL/6AFg/+gBYf/oAWv/6AGEAAwBhQAMAYcADAGIAAwBiQAMAdMADQHWAA0B2AAOAdn/9QHb/+wB3f/tAeX/7AHr/78B7P/tAe3/vwH0AA4B9f/tAfgADgIQAA4CEf/tAhIADQIUAA4CGv/tAjH/7gIz/78Cof/oAqL/6AKj/+gCpP/oAqX/6AKr/+oCrP/qAq3/6gKu/+oCr//qArQACwK1AAsCvf/oAr//6ALB/+gCw//oAsX/6ALH/+gCyf/oAsv/6ALN/+gCz//oAtH/6ALT/+gC1f/oAtf/6AL5/+oC+//qAv3/6gMjAAsDMv+/AzP/vwM0/78DNf+/Azb/vwM3/78DOP+/Azn/7QND/+0DRP/tA0X/7QNG/+0DR//tA0wADQNN/78DTv+/A0//vwNQ/+0DUf/tA1L/7QNT/+0DWv/tA1v/7QNc/+0DXf/tA23/7QNu/+0Db//tA3P/9QN0//UDdf/1A3b/9QN4AA4DgQANA4IADQOe/+gDpP/qA6YACwOq/+oDxP/oA8b/6gPI/+gDyQALA8v/6APSAAsD2gALA9sADAPcAAwD3wAMA+b/6APrAAsD7P/oA/H/6APzAAsD///oBAH/6AQC/+gEDP/qBA7/6AQQ/+oEFAALBBYACwQYAAsEHf/oBDf/6AQ5/+gEO//oBD3/6AQ//+gEQf/oBEP/6ARF/+gES//qBE3/6gRP/+oEUf/qBFP/6gRV/+oEV//qBFn/6ARb/+gEXf/oBF//6gRh/+gEcQALBHMACwR1AAsEnP/oBKD/6gSp/+gEq//oBMMACwTFAAsEy/+/BM//7QTQAA0E0v+/BN4ADQThAA0E6v+/BPH/7QT0/+0E9QAOBPn/7QT6AA0AAQD2/9gADgBc/+0AXv/tAO7/7QD2/6oBNP/tAUT/7QFe/+0DJv/tAyj/7QMq/+0Dyv/tA/b/7QQE/+0Eyf/tAA0AXP/yAF7/8gDu//IBNP/yAUT/8gFe//IDJv/yAyj/8gMq//IDyv/yA/b/8gQE//IEyf/yACIAWv/0AFz/8gBd//QAXv/zAL3/9ADu//IBGv/0ATT/8gFE//IBXv/yArT/9AK1//QDI//0Ayb/8wMo//MDKv/zA6b/9APJ//QDyv/yA9L/9APa//QD6//0A/P/9AP2//IEBP/yBBT/9AQW//QEGP/0BHH/9ARz//QEdf/0BMP/9ATF//QEyf/zAIwABv/KAAv/ygA4/9IAOv/UADz/9AA9/9MAUf/RAFL/0QBU/9EAWv/mAFz/7wBd/+YAvf/mAMH/0QDS/9IA1v/SANr/9ADe/+0A4f/hAOb/1ADs/9EA7v/vAPD/0QDx/9EA8//RAPT/0QD1/9EA9v/JAPj/0QD6/9EA+//RAP7/0QEA/9EBBf/RAQn/5QEZ/9QBGv/mASD/4wEr/9EBM//0ATT/7wE2/9EBOf/SATr/xAE8/9EBPv/RAUP/9AFE/+8BRf/SAUf/4QFJ/+EBU//RAVX/0QFX/9EBXP/RAV3/9AFe/+8BYv/UAWP/9QFk/+cBbP/SAW3/yQGE/8oBhf/KAYf/ygGI/8oBif/KApn/0wKq/9ECtP/mArX/5gLy/9EC9P/RAvb/0QL3/9EDDv/SAxD/0gMS/9IDIv/TAyP/5gMk/9MDi//TA5r/0wOb//QDnf/TA6D/0QOm/+YDtf/tA8H/0gPC//QDxf/RA8f/0QPJ/+YDyv/vA8z/0QPR/9ED0v/mA9n/0wPa/+YD2//KA9z/ygPf/8oD4f/RA+f/0QPq/9QD6//mA/L/0wPz/+YD9f/0A/b/7wQD//QEBP/vBAj/0QQK/9EEE//tBBT/5gQV/+0EFv/mBBf/7QQY/+YEGf/hBBz/0QRw/9MEcf/mBHL/0wRz/+YEdP/TBHX/5gR3/9IEef/hBHz/0QSG/9MEmP/RBLX/0QS3/9EEv//SBML/1ATD/+YExP/UBMX/5gAoADj/vgBa/+8AXf/vAL3/7wDS/74A1v++AOb/yQD2/98BCf/tARr/7wEg/+sBOf++ATr/3wFF/74BTP/pAWP/9QFt/+ACtP/vArX/7wMO/74DEP++AxL/vgMj/+8Dpv/vA8H/vgPJ/+8D0v/vA9r/7wPr/+8D8//vBBT/7wQW/+8EGP/vBHH/7wRz/+8Edf/vBHf/vgS//74Ew//vBMX/7wA/ADj/5gA6/+cAPP/yAD3/5wBc//EA0v/mANb/5gDa//IA3v/uAOH/6ADm/+YA7v/xAPb/0AEZ/+cBM//yATT/8QE5/+YBOv/OAUP/8gFE//EBRf/m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AQ0BDQBHARgBGgBIAS4BMABLATMBNQBOATcBNwBRATkBOQBSATsBOwBTAUMBRABUAVQBVABWAVYBVgBXAVgBWABYAVwBXgBZAYQBigBcAY4BjwBjAdgB2ABlAd0B3QBmAeAB4QBnAesB7QBpAf8B/wBsAg4CEABtAjACMABwAjMCMwBxAkUCRQByAkcCSABzAnoCewB1An0CfQB3An8CpQB4AqoCrwCfArQCxAClAsYCzwC2AtgC2gDAAtwC3ADDAt4C3gDEAuAC4ADFAuIC4gDGAuUC5QDHAucC5wDIAukC6QDJAusC6wDKAu0C7QDLAu8C7wDMAvEC/QDNAv8C/wDaAwEDAQDbAwMDAwDcAw4DDgDdAxADEADeAxIDEgDfAxQDFADgAxYDFgDhAxgDGADiAxoDGgDjAxwDHADkAx4DHgDlAyADIADmAyIDKgDnAy8DOADwA0MDRwD6A00DTwD/A1QDVAECA2UDaQEDA20DbwEIA3gDeAELA4YDiwEMA44DnQESA6ADoAEiA6QDpAEjA6YDpgEkA6oDqgElA60DrgEmA7ADuQEoA7sDvQEyA78DxAE1A8YDzAE7A9ID0wFCA9UD1QFEA9cD1wFFA9kD3AFGA98D5AFKA+YD5gFQA+oD6wFRA/AD+wFTA/4D/wFfBAEEBAFhBAsEDAFlBBAEEAFnBBIEGAFoBB4ERgFvBEgESAGYBEoEVwGZBF8EXwGnBGIEYgGoBGQEZAGpBHAEdQGqBHcEdwGwBHsEfAGxBH8EfwGzBIEEggG0BIQEhAG2BIYEhgG3BJcEmwG4BJ0EnQG9BJ8EoAG+BKIEogHABKYEqAHBBKoEqgHEBKwErgHFBLAEsAHIBLIEsgHJBLQEugHKBLwEvAHRBL8EvwHSBMEExgHTBMgEywHZBM8EzwHdBNIE0gHeBNgE2AHfBN0E3QHgBOgE6AHhBOoE6gHiBPEE8QHjBPUE9QHkAAIBdAAGAAYAGQALAAsAGQAQABAAIQASABIAIQAlACUAAgAmACYAHAAnACcAEwAoACgAAQApACkABQAuAC4ACgAvAC8ACwAwADAAGAAzADMAAQA0ADQAFgA4ADgADgA5ADkACgA6ADoAHQA7ADsAGwA8ADwAEgA9AD0ADAA+AD4AEQBFAEUABgBGAEYABwBHAEcAFwBJAEkACABMAEwABABRAFIABABT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AAAAAAACAAEAEQAVAAsAAAAgACEAAAAAAAAAAAAAAAAAAAAZABsAAAADAAAAAwAAAAMAAAAAAAAAAAADABEAFQAAAAEAAQAAAAAAAAAAABkAAAAAAAAAAgABAAAAAAAAABkAGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AHwAAABQAFAAaABQAFAAUABoAAAAAAAAAGgAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAcACQAAAASABgAHgAAAAgAAAAIAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAADQAIAA0AAAAAAAAAAAAAAAAAGAAIAAAAAAAYAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAYAAgAFwAcABgAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAAGAAYABgAGAAYABgAGAAIAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAIAAgACAAoACgAKAAoADAAHAAcABwAHAAcABwAHAAEAAQABAAEAAQAAAAAAAAAAAAMABAAEAAQABAAEAAUABQAFAAUACQAJAAYABwAGAAcABgAHAAIAAQACAAEAAgABAAIAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQACAAEAAgABAAIAAQACAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAADAAAAAwADAAIABAACAAQAAgAEAAAAAAAAAAAAAAAAABAADgAQAA4AEAAOABAADgAQAA4ACwAAAAsAAAALAAAACgAFAAoABQAKAAUACgAFAAoABQAKAAUAFgAAAAwACQAMABMADwATAA8AEwAPAAAAAAACAAAAAAAAAAAADQANAA0ADQANAA0ADQAIAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAIAAgACAASABIAEgASABcADQANAA0ACAAIAAgACAAAAAAAAAAAAAAAAAAIAAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAIAAAAAAAAAB4AHgAeAB4AAAAYAAAAEgASABIAEgASABIAJAAXABcAAAAAAAAABgAAAAAAAAACAAwAAAAAAAYAAAAAABMAAAAAAAAAAAAAAAIAAAAAAAwAEQAAAAwAAQAAAAMAAAAFAAAABAAAAAkAAAAAAAUABAAFAAAAAAAAAAAAAAAAACMAAAAAACIABgAAAAAAAAAAAAAAAAACAAAAAAACAAsAEQAHAAEAAwAEAAMAAQAJABUAAQADAA4AAAAAAAAAAwAJABYAAAAWAAAAFgAAAAwACQAUABQAAAAAABQAAAADAAYABwAAAAAAAQADAAAAAAAdAAkAAQACAAAAAAACAAEADAAJAAAAEQAVAAAABgAHAAYABwAAAAAAAAABAAAAAQABABEAFQAAAAAAAAADAAAAAwACAAQAAgABAAIABAAAAAAAIgAJACIACQAiAAkAIAAhAAAAAwABAAYABwAGAAcABgAHAAYABwAGAAcABgAHAAYABwAGAAcABgAHAAYABwAGAAcABgAHAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAAAAAAAAACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgABAAIAAQACAAEAAgAEAAIAAQAKAAUACgAFAAAABQAAAAUAAAAFAAAABQAAAAUADAAJAAwACQAMAAkAAAALAAAAIAAhAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAYABwAAAAEAAAAAAAIABAAAAAAAAAAFAAAAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAMAAgAAAAAAAAAAABAADgALAAAACgAdAAkAHQAJABYAAAATAA8AAAANAAAAAAAAAAgAFwAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcAHAAAABcAAAAAAAAAAAAAAAAAAAAAAA0AAAAAAAAAAAAAAAAACAAAAAAACAAYABwAAAAAAAgAFwABAAAACgFiApIABERGTFQAGmN5cmwAGmdyZWsAGmxhdG4ASAAEAAAAAP//ABIAAAABAAIAAwAEAAgADAANAA4ADwAQABEAEgATABQAFQAWABcALgAHQVpFIADkQ1JUIADkRlJBIABaTU9MIAC2TkFWIACIUk9NIAC2VFJLIADkAAD//wATAAAAAQACAAMABAAHAAgADAANAA4ADwAQABEAEgATABQAFQAWABcAAP//ABQAAAABAAIAAwAEAAYACAAJAAwADQAOAA8AEAARABIAEwAUABUAFgAXAAD//wAUAAAAAQACAAMABAAGAAgACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAA//8AFAAAAAEAAgADAAQABgAIAAoADAANAA4ADwAQABEAEgATABQAFQAWABcAAP//ABMAAAABAAIAAwAEAAUACAAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYYzJzYwCSY2NtcACYZGxpZwCgZG5vbQCmZnJhYwCsbGlnYQC2bGlnYQC8bGlnYQDIbG51bQDQbG9jbADWbG9jbADcbG9jbADibnVtcgDob251bQDucG51bQD0c21jcAD6c3MwMQEAc3MwMgEGc3MwMwEMc3MwNAESc3MwNQEYc3MwNgEec3MwNwEkdG51bQEqAAAAAQAAAAAAAgACAAQAAAABAAoAAAABABgAAAADABYAFwAZAAAAAQAJAAAABAAIAAkACAAJAAAAAgAIAAkAAAABABUAAAABAAcAAAABAAUAAAABAAYAAAABABkAAAABABIAAAABABMAAAABAAEAAAABAAsAAAABAAwAAAABAA0AAAABAA4AAAABAA8AAAABABAAAAABABEAAAABABQAGgA2BDAH7gigCMoPbg+ED64Pwg/mEBAQTBBgEHQQiBCaELQQ9hEUEWYRrBIOEmwSgBKwEtIAAQAAAAEACAACAfoA+gHnAnEB0QHQAc8BzgHNAcwBywHKAckByAIzAjICMQIwAigB5gHlAeQB4wHiAeEB4AHfAd4B3QHcAdsB2gHZAdgB1wHWAdUB1AHTAdIB6AHpAnMCdQJ0AnYCcgJ3AlIB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4CAAIBBP4CAgIDAgQCBQIGAgcCCAIJAgoCCwI7Ag0CDgIPAhAE+AIRAhMCFAIVAhYCFwIYAhkCGwIcAh4CHQMvAzADMQMyAzMDNAM1AzYDNwM4AzkDOgM7AzwDPQM+Az8DQANBA0IDQwNEA0UDRgNHA0gDSQNKA0sDTANNA04DTwNQA1EDUgNTA1QDVQNWA1cDWANZA1oDWwNcA10DXgNfA2ADYQNiA2ME/wNkA2UDZgNnA2gDaQNqA2sDbANtA24DbwNwA3EDcgNzA3QDdQUCA3YDdwN5A3gDegN7A3wDfQN+A38DgAOBA4IDgwOEA4UFAAUBBMsEzATNBM4EzwTQBNEE0gTTBNQE1QTWBNcE2ATZBNoE2wTcBN0E3gTfBOAE4QTiBOME5ATlBOYE5wH/BOgE6QTqBOsE7ATtBO4E7wTwBPEE8gTzBPQE9QT2BQMFBAUFBQYE9wT5BPoE/AIaBP0E+wIMAhIFCwUMAAEA+gAIAAoAFAAVABYAFwAYABkAGgAbABwAHQAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AD4AZQBnAIEAgwCEAIwAjwCRAJMAsQCyALMAtAC1ALYAtwC4ALkAugDSANMA1ADVANYA1wDYANkA2gDbANwA3QDeAN8A4ADhAOIA4wDkAOUA5gDnAOgA6QEvATMBNQE3ATkBOwFBAUMBRQFJAUsBTAFYAVkBlwGdAaIBpQJ6AnsCfQJ/AoACgQKCAoMChAKFAoYChwKIAokCigKLAowCjQKOAo8CkAKRApICkwKUApUClgKXApgCmQK2ArgCugK8Ar4CwALCAsQCxgLIAsoCzALOAtAC0gLUAtYC2ALaAtwC3gLgAuIC4wLlAucC6QLrAu0C7wLxAvMC9QL4AvoC/AL+AwADAgMEAwYDCAMKAwwDDgMQAxIDFAMWAxgDGgMcAx4DIAMiAyQDJQMnAykDKwMtA4YDhwOIA4kDigOLA4wDjgOPA5ADkQOSA5MDlAOVA5YDlwOYA5kDmgObA5wDnQOtA64DrwOwA7EDsgOzA7QDtQO2A7cDuAO5A7oDuwO8A70DvgO/A8ADwQPCA9MD1QPXA9kD7gPwA/IEBwQNBBMEfQSCBIYFBwUJAAEAAAABAAgAAgHcAOsCcQIzAjICMQIwAigB5gHlAeQB4wHiAeEB4AHfAd4B3QHcAdsB2gHZAdgB1wHWAdUB1AHTAdICZAJzAzACdQJ0Ay8B4wJyAncCUgTSBNMB6gHrBNQE1QTWAewE1wHtAe4B7wTcAfAB8ATdBN4B8QHyAfMB+gTrBOwB+wH8Af0B/gH/AgAE7wTwBPIE9QT+AgICAwIEAgUCBgIHAggCCQIKAgsB9AH1AfYB9wH4AfkCOwINAg4CDwIQBPgCEQITAhQCFQIXAhkCdgMxAzIDMwM0AzUDNgM3AzgDOQM6AzsDPAM9Az4DPwNAA0EDQgNDA0QDRQNGA0cDSANJA0oDSwNMA4IDTQNOA08DUANRA1IDUwNUA1UDVgNXA1gDWQNaA1sDXANdA14DXwNgA2EDYgT/A2QDZQNmA2cDaANpA2oDawNsA20DbgNvA3ADcQNyA3MDdAN1BQIDdgN3A3kDeAN6A3sDfAN9A34DfwOAA4EDgwOEA4UFAAUBBMsEzATNBM4E2ATbBNkE2gTfBOAE4QTPBNAE0QTqBO0E7gTxBPME9AIBBPYE4gTjBOQE5QTmBOcE6ATpBQMFBAUFBQYE9wT5BPoCGAT8AhoE/QT7AhYCDAISBQsFDAABAOsACgBFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AhQCGAIcAiQCKAIsAjQCQAJIAlAC7ALwAvQC+AL8AwADBAMIAwwDEAMUAxgDHAMgAyQDKAMsAzADNAM4A6gDrAOwA7QDuAO8A8ADxAPIA8wD0APUA9gD3APgA+QD6APsA/AD9AP4A/wEAAQEBAgEDAQQBBQEGAQcBMAE0ATYBOAE6ATwBQgFEAUYBSgFNAVoCfAJ+ApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwKoAqkCqgKrAqwCrQKuAq8CsAKxArICswK0ArUCtwK5ArsCvQK/AsECwwLFAscCyQLLAs0CzwLRAtMC1QLXAtkC2wLdAt8C4QLkAuYC6ALqAuwC7gLwAvIC9AL2AvkC+wL9Av8DAQMDAwUDBwMJAwsDDQMPAxEDEwMVAxcDGQMbAx0DHwMhAyMDJgMoAyoDLAMuA54DnwOgA6EDowOkA6UDpgOnA6gDqQOqA6sDrAPDA8QDxQPGA8cDyAPJA8oDywPMA80DzgPPA9AD0QPSA9QD1gPYA9oD7wPxA/MEAQQIBA4EFAR+BH8EgwSHBQgFCgAGAAAABgASACoAQgBaAHIAigADAAAAAQASAAEAkAABAAAAAwABAAEATQADAAAAAQASAAEAeAABAAAAAwABAAEATgADAAAAAQASAAEAYAABAAAAAwABAAEC4QADAAAAAQASAAEASAABAAAAAwABAAEDzgADAAAAAQASAAEAMAABAAAAAwABAAED0AADAAAAAQASAAEAGAABAAAAAwABAAEESQACAAIAqACsAAABJAEnAAUAAQAAAAEACAACABIABgJhAl8CYgJjAmAFDQABAAYATQBOAuEDzgPQBEkABAAAAAEACAABBjIANgByAKQArgC4AMoA/AEOARgBSgFkAX4BkAG6AfYCAAIiAjwCTgKKApwCtgLgAvIDJAMuAzgDSgN8A4YDkAOaA7QDzgPgBAoEPARGBGgEggSUBMYE2ATyBRwFLgU4BUIFTAVWBYAFqgXUBf4GKAAGAA4AFAAaACAAJgAsAoAAAgCpBB4AAgCtAn8AAgCoBCAAAgCrAoIAAgCqBJkAAgCsAAEABASmAAIArQABAAQCvAACAKkAAgAGAAwEqgACAboEqAACAK0ABgAOABQAGgAgACYALAKIAAIAqQQ2AAIArQKHAAIAqAQ4AAIAqwQ6AAIAqgSbAAIArAACAAYADASVAAIAqQLWAAIBugABAAQErAACAK0ABgAOABQAGgAgACYALAKMAAIAqQRIAAIArQKLAAIAqARGAAIAqwLaAAIAqgSdAAIArAADAAgADgAUBK4AAgCpAucAAgG6BLAAAgCtAAMACAAOABQC6QACAKkC6wACAboEsgACAK0AAgAGAAwD4AACAKkEtAACAK0ABQAMABIAGAAeACQC8QACAKkC8wACAboEtgACAK0ElwACAKgCjwACAKoABwAQABgAHgAkACoAMAA2BLgAAwCqAKkCkQACAKkESgACAK0CkAACAKgETAACAKsCkwACAKoEnwACAKwAAQAEBLkAAgCpAAQACgAQABYAHAL+AAIAqQMAAAIBugS7AAIArQShAAIArAADAAgADgAUAwQAAgCpAwoAAgG6BL0AAgCtAAIABgAMAw4AAgG6BL8AAgCtAAcAEAAYAB4AJAAqADAANgTBAAMAqgCpApYAAgCpBGIAAgCtApUAAgCoBGQAAgCrAxQAAgCqBKMAAgCsAAIABgAMBMQAAgCtBMIAAgCqAAMACAAOABQD1QACAKkExgACAK0D0wACAKgABQAMABIAGAAeACQCmQACAKkEcAACAK0D2QACAKgEcgACAKsEdAACAKoAAgAGAAwDJQACAKkEyAACAK0ABgAOABQAGgAgACYALAKbAAIAqQQfAAIArQKaAAIAqAQhAAIAqwKdAAIAqgSaAAIArAABAAQEpwACAK0AAQAEAr0AAgCpAAIABgAMBKsAAgG6BKkAAgCtAAYADgAUABoAIAAmACwCowACAKkENwACAK0CogACAKgEOQACAKsEOwACAKoEnAACAKwAAQAEBJYAAgCpAAEABAStAAIArQABAAQESQACAK0AAwAIAA4AFASvAAIAqQLoAAIBugSxAAIArQADAAgADgAUAuoAAgCpAuwAAgG6BLMAAgCtAAIABgAMA+EAAgCpBLUAAgCtAAUADAASABgAHgAkAvIAAgCpAvQAAgG6BLcAAgCtBJgAAgCoAqoAAgCqAAYADgAUABoAIAAmACwCrAACAKkESwACAK0CqwACAKgETQACAKsCrgACAKoEoAACAKwAAQAEBLoAAgCpAAQACgAQABYAHAL/AAIAqQMBAAIBugS8AAIArQSiAAIArAADAAgADgAUAwUAAgCpAwsAAgG6BL4AAgCtAAIABgAMAw8AAgG6BMAAAgCtAAYADgAUABoAIAAmACwCsQACAKkEYwACAK0CsAACAKgEZQACAKsDFQACAKoEpAACAKwAAgAGAAwExQACAK0EwwACAKoAAwAIAA4AFAPWAAIAqQTHAAIArQPUAAIAqAAFAAwAEgAYAB4AJAK0AAIAqQRxAAIArQPaAAIAqARzAAIAqwR1AAIAqgACAAYADAMmAAIAqQTJAAIArQABAAQDKwACAKkAAQAEAy0AAgCpAAEABAMsAAIAqQABAAQDLgACAKkABQAMABIAGAAeACQCpwACAKkCpgACAKgERwACAKsC2wACAKoEngACAKwABQAMABIAGAAeACQEWAACAKkEYAACAK0EWgACAKgEXAACAKsEXgACAKoABQAMABIAGAAeACQEWQACAKkEYQACAK0EWwACAKgEXQACAKsEXwACAKoABQAMABIAGAAeACQEZgACAKkEbgACAK0EaAACAKgEagACAKsEbAACAKoABQAMABIAGAAeACQEZwACAKkEbwACAK0EaQACAKgEawACAKsEbQACAKoAAQAEBKUAAgCpAAIAEQAlACkAAAArAC0ABQAvADQACAA2ADsADgA9AD4AFABFAEkAFgBLAE0AGwBPAFQAHgBWAFsAJABdAF4AKgCBAIEALACDAIMALQCGAIYALgCJAIkALwCNAI0AMACYAJsAMQDQANAANQABAAAAAQAIAAEABgACAAEAAgMIAwkAAQAAAAEACAACABIABgUHBQgFCQUKBQsFDAABAAYCugK7AswCzQNPA1gAAQAAAAEACAABAAYAAQABAAEBewAEAAAAAQAIAAEAQAABAAgAAgAGAA4BvgADAEoATQG8AAIATQAEAAAAAQAIAAEAHAABAAgAAgAGAA4BvwADAEoAUAG9AAIAUAABAAEASgAEAAAAAQAIAAEAKgADAAwAFgAgAAEABAG7AAIASgABAAQBwQACAFgAAQAEAcAAAgBYAAEAAwBKAFcAlQABAAAAAQAIAAEABgHeAAEAAQBLAAEAAAABAAgAAQAGAW8AAQABALsAAQAAAAEACAABAAYB9QABAAEANgABAAAAAQAIAAIAHAACAiwCLQABAAAAAQAIAAIACgACAi4CLwABAAIALwBPAAEAAAABAAgAAgAeAAwCRQJHAkYCSAJJAmcCaAJpAmoCawJsAm0AAQAMACcAKAArADMANQBGAEcASABLAFMAVABVAAEAAAABAAgAAgAMAAMCbgJvAm8AAQADAEkASwJqAAEAAAABAAgAAgAuABQCWgJeAlgCVQJXAlYCWwJZAl0CXAJPAkoCSwJMAk0CTgAaABwCUwJlAAIABAAUAB0AAAJmAmYACgJwAnAACwSNBJQADAABAAAAAQAIAAIALgAUBJQCcASNBI4EjwSQBJECZgSSBJMCTAJOAk0CSwJPAmUAGgJTABwCSgACAAIAFAAdAAACVQJeAAoAAQAAAAEACAACAC4AFAJbAl0CXgJYAlUCVwJWAlkCXAJaABsAFQAWABcAGAAZABoAHAAdABQAAQAUABoAHAJKAksCTAJNAk4CTwJTAmUCZgJwBI0EjgSPBJAEkQSSBJMElAABAAAAAQAIAAIALgAUBJEEkgJwBI0EjgSPBJACZgSTABcAGQAYABYAGwAUABoAHQAcABUElAACAAYAGgAaAAAAHAAcAAECSgJPAAICUwJTAAgCVQJeAAkCZQJlABMAAQAAAAEACAABAAYBgQABAAEAEwAGAAAAAQAIAAMAAQASAAEAbAAAAAEAAAAYAAIAAwGUAZQAAAHFAccAAQIfAiUABAABAAAAAQAIAAIAPAAKAccBxgHFAh8CIAIhAiICIwIkAiUAAQAAAAEACAACABoACgI+AHoAcwB0Aj8CQAJBAkICQwJEAAIAAQAUAB0AAA==",
};
/*!
 Buttons for DataTables 1.6.5
 ©2016-2020 SpryMedia Ltd - datatables.net/license
*/
(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(q){return e(q,window,document)}):"object"===typeof exports?module.exports=function(q,r){q||(q=window);if(!r||!r.fn.dataTable)r=require("datatables.net")(q,r).$;return e(r,q,q.document)}:e(jQuery,window,document)})(function(e,q,r,m){function w(a,b,c){e.fn.animate?a.stop().fadeIn(b,c):(a.css("display","block"),c&&c.call(a))}function x(a,b,c){e.fn.animate?a.stop().fadeOut(b,c):(a.css("display","none"),c&&
c.call(a))}function z(a,b){var c=new i.Api(a),d=b?b:c.init().buttons||i.defaults.buttons;return(new p(c,d)).container()}var i=e.fn.dataTable,C=0,D=0,l=i.ext.buttons,p=function(a,b){if(!(this instanceof p))return function(b){return(new p(b,a)).container()};"undefined"===typeof b&&(b={});!0===b&&(b={});Array.isArray(b)&&(b={buttons:b});this.c=e.extend(!0,{},p.defaults,b);b.buttons&&(this.c.buttons=b.buttons);this.s={dt:new i.Api(a),buttons:[],listenKeys:"",namespace:"dtb"+C++};this.dom={container:e("<"+
this.c.dom.container.tag+"/>").addClass(this.c.dom.container.className)};this._constructor()};e.extend(p.prototype,{action:function(a,b){var c=this._nodeToButton(a);if(b===m)return c.conf.action;c.conf.action=b;return this},active:function(a,b){var c=this._nodeToButton(a),d=this.c.dom.button.active,c=e(c.node);if(b===m)return c.hasClass(d);c.toggleClass(d,b===m?!0:b);return this},add:function(a,b){var c=this.s.buttons;if("string"===typeof b){for(var d=b.split("-"),e=this.s,c=0,f=d.length-1;c<f;c++)e=
e.buttons[1*d[c]];c=e.buttons;b=1*d[d.length-1]}this._expandButton(c,a,e!==m,b);this._draw();return this},container:function(){return this.dom.container},disable:function(a){a=this._nodeToButton(a);e(a.node).addClass(this.c.dom.button.disabled).attr("disabled",!0);return this},destroy:function(){e("body").off("keyup."+this.s.namespace);var a=this.s.buttons.slice(),b,c;b=0;for(c=a.length;b<c;b++)this.remove(a[b].node);this.dom.container.remove();a=this.s.dt.settings()[0];b=0;for(c=a.length;b<c;b++)if(a.inst===
this){a.splice(b,1);break}return this},enable:function(a,b){if(!1===b)return this.disable(a);var c=this._nodeToButton(a);e(c.node).removeClass(this.c.dom.button.disabled).removeAttr("disabled");return this},name:function(){return this.c.name},node:function(a){if(!a)return this.dom.container;a=this._nodeToButton(a);return e(a.node)},processing:function(a,b){var c=this.s.dt,d=this._nodeToButton(a);if(b===m)return e(d.node).hasClass("processing");e(d.node).toggleClass("processing",b);e(c.table().node()).triggerHandler("buttons-processing.dt",
[b,c.button(a),c,e(a),d.conf]);return this},remove:function(a){var b=this._nodeToButton(a),c=this._nodeToHost(a),d=this.s.dt;if(b.buttons.length)for(var g=b.buttons.length-1;0<=g;g--)this.remove(b.buttons[g].node);b.conf.destroy&&b.conf.destroy.call(d.button(a),d,e(a),b.conf);this._removeKey(b.conf);e(b.node).remove();a=e.inArray(b,c);c.splice(a,1);return this},text:function(a,b){var c=this._nodeToButton(a),d=this.c.dom.collection.buttonLiner,d=c.inCollection&&d&&d.tag?d.tag:this.c.dom.buttonLiner.tag,
g=this.s.dt,f=e(c.node),h=function(a){return"function"===typeof a?a(g,f,c.conf):a};if(b===m)return h(c.conf.text);c.conf.text=b;d?f.children(d).html(h(b)):f.html(h(b));return this},_constructor:function(){var a=this,b=this.s.dt,c=b.settings()[0],d=this.c.buttons;c._buttons||(c._buttons=[]);c._buttons.push({inst:this,name:this.c.name});for(var g=0,f=d.length;g<f;g++)this.add(d[g]);b.on("destroy",function(b,d){d===c&&a.destroy()});e("body").on("keyup."+this.s.namespace,function(b){if(!r.activeElement||
r.activeElement===r.body){var c=String.fromCharCode(b.keyCode).toLowerCase();a.s.listenKeys.toLowerCase().indexOf(c)!==-1&&a._keypress(c,b)}})},_addKey:function(a){a.key&&(this.s.listenKeys+=e.isPlainObject(a.key)?a.key.key:a.key)},_draw:function(a,b){a||(a=this.dom.container,b=this.s.buttons);a.children().detach();for(var c=0,d=b.length;c<d;c++)a.append(b[c].inserter),a.append(" "),b[c].buttons&&b[c].buttons.length&&this._draw(b[c].collection,b[c].buttons)},_expandButton:function(a,b,c,d){for(var g=
this.s.dt,f=0,b=!Array.isArray(b)?[b]:b,h=0,k=b.length;h<k;h++){var n=this._resolveExtends(b[h]);if(n)if(Array.isArray(n))this._expandButton(a,n,c,d);else{var j=this._buildButton(n,c);j&&(d!==m&&null!==d?(a.splice(d,0,j),d++):a.push(j),j.conf.buttons&&(j.collection=e("<"+this.c.dom.collection.tag+"/>"),j.conf._collection=j.collection,this._expandButton(j.buttons,j.conf.buttons,!0,d)),n.init&&n.init.call(g.button(j.node),g,e(j.node),n),f++)}}},_buildButton:function(a,b){var c=this.c.dom.button,d=this.c.dom.buttonLiner,
g=this.c.dom.collection,f=this.s.dt,h=function(b){return"function"===typeof b?b(f,j,a):b};b&&g.button&&(c=g.button);b&&g.buttonLiner&&(d=g.buttonLiner);if(a.available&&!a.available(f,a))return!1;var k=function(a,b,c,d){d.action.call(b.button(c),a,b,c,d);e(b.table().node()).triggerHandler("buttons-action.dt",[b.button(c),b,c,d])},g=a.tag||c.tag,n=a.clickBlurs===m?!0:a.clickBlurs,j=e("<"+g+"/>").addClass(c.className).attr("tabindex",this.s.dt.settings()[0].iTabIndex).attr("aria-controls",this.s.dt.table().node().id).on("click.dtb",
function(b){b.preventDefault();!j.hasClass(c.disabled)&&a.action&&k(b,f,j,a);n&&j.trigger("blur")}).on("keyup.dtb",function(b){b.keyCode===13&&!j.hasClass(c.disabled)&&a.action&&k(b,f,j,a)});"a"===g.toLowerCase()&&j.attr("href","#");"button"===g.toLowerCase()&&j.attr("type","button");d.tag?(g=e("<"+d.tag+"/>").html(h(a.text)).addClass(d.className),"a"===d.tag.toLowerCase()&&g.attr("href","#"),j.append(g)):j.html(h(a.text));!1===a.enabled&&j.addClass(c.disabled);a.className&&j.addClass(a.className);
a.titleAttr&&j.attr("title",h(a.titleAttr));a.attr&&j.attr(a.attr);a.namespace||(a.namespace=".dt-button-"+D++);d=(d=this.c.dom.buttonContainer)&&d.tag?e("<"+d.tag+"/>").addClass(d.className).append(j):j;this._addKey(a);this.c.buttonCreated&&(d=this.c.buttonCreated(a,d));return{conf:a,node:j.get(0),inserter:d,buttons:[],inCollection:b,collection:null}},_nodeToButton:function(a,b){b||(b=this.s.buttons);for(var c=0,d=b.length;c<d;c++){if(b[c].node===a)return b[c];if(b[c].buttons.length){var e=this._nodeToButton(a,
b[c].buttons);if(e)return e}}},_nodeToHost:function(a,b){b||(b=this.s.buttons);for(var c=0,d=b.length;c<d;c++){if(b[c].node===a)return b;if(b[c].buttons.length){var e=this._nodeToHost(a,b[c].buttons);if(e)return e}}},_keypress:function(a,b){if(!b._buttonsHandled){var c=function(d){for(var g=0,f=d.length;g<f;g++){var h=d[g].conf,k=d[g].node;if(h.key)if(h.key===a)b._buttonsHandled=!0,e(k).click();else if(e.isPlainObject(h.key)&&h.key.key===a&&(!h.key.shiftKey||b.shiftKey))if(!h.key.altKey||b.altKey)if(!h.key.ctrlKey||
b.ctrlKey)if(!h.key.metaKey||b.metaKey)b._buttonsHandled=!0,e(k).click();d[g].buttons.length&&c(d[g].buttons)}};c(this.s.buttons)}},_removeKey:function(a){if(a.key){var b=e.isPlainObject(a.key)?a.key.key:a.key,a=this.s.listenKeys.split(""),b=e.inArray(b,a);a.splice(b,1);this.s.listenKeys=a.join("")}},_resolveExtends:function(a){for(var b=this.s.dt,c,d,g=function(c){for(var d=0;!e.isPlainObject(c)&&!Array.isArray(c);){if(c===m)return;if("function"===typeof c){if(c=c(b,a),!c)return!1}else if("string"===
typeof c){if(!l[c])throw"Unknown button type: "+c;c=l[c]}d++;if(30<d)throw"Buttons: Too many iterations";}return Array.isArray(c)?c:e.extend({},c)},a=g(a);a&&a.extend;){if(!l[a.extend])throw"Cannot extend unknown button type: "+a.extend;var f=g(l[a.extend]);if(Array.isArray(f))return f;if(!f)return!1;c=f.className;a=e.extend({},f,a);c&&a.className!==c&&(a.className=c+" "+a.className);var h=a.postfixButtons;if(h){a.buttons||(a.buttons=[]);c=0;for(d=h.length;c<d;c++)a.buttons.push(h[c]);a.postfixButtons=
null}if(h=a.prefixButtons){a.buttons||(a.buttons=[]);c=0;for(d=h.length;c<d;c++)a.buttons.splice(c,0,h[c]);a.prefixButtons=null}a.extend=f.extend}return a},_popover:function(a,b,c){var d=this.c,g=e.extend({align:"button-left",autoClose:!1,background:!0,backgroundClassName:"dt-button-background",contentClassName:d.dom.collection.className,collectionLayout:"",collectionTitle:"",dropup:!1,fade:400,rightAlignClassName:"dt-button-right",tag:d.dom.collection.tag},c),f=b.node(),h=function(){x(e(".dt-button-collection"),
g.fade,function(){e(this).detach()});e(b.buttons('[aria-haspopup="true"][aria-expanded="true"]').nodes()).attr("aria-expanded","false");e("div.dt-button-background").off("click.dtb-collection");p.background(!1,g.backgroundClassName,g.fade,f);e("body").off(".dtb-collection");b.off("buttons-action.b-internal")};!1===a&&h();c=e(b.buttons('[aria-haspopup="true"][aria-expanded="true"]').nodes());c.length&&(f=c.eq(0),h());c=e("<div/>").addClass("dt-button-collection").addClass(g.collectionLayout).css("display",
"none");a=e(a).addClass(g.contentClassName).attr("role","menu").appendTo(c);f.attr("aria-expanded","true");f.parents("body")[0]!==r.body&&(f=r.body.lastChild);g.collectionTitle&&c.prepend('<div class="dt-button-collection-title">'+g.collectionTitle+"</div>");w(c.insertAfter(f),g.fade);var d=e(b.table().container()),k=c.css("position");"dt-container"===g.align&&(f=f.parent(),c.css("width",d.width()));if("absolute"===k&&(c.hasClass(g.rightAlignClassName)||c.hasClass(g.leftAlignClassName)||"dt-container"===
g.align)){var n=f.position();c.css({top:n.top+f.outerHeight(),left:n.left});var j=c.outerHeight(),i=d.offset().top+d.height(),t=n.top+f.outerHeight()+j,i=t-i,t=n.top-j,m=d.offset().top,l=n.top-j-5;(i>m-t||g.dropup)&&-l<m&&c.css("top",l);var n=d.offset().left,d=d.width(),d=n+d,k=c.offset().left,s=c.width(),s=k+s,o=f.offset().left,u=f.outerWidth(),u=o+u,o=0;c.hasClass(g.rightAlignClassName)?(o=u-s,n>k+o&&(k=n-(k+o),d-=s+o,o=k>d?o+d:o+k)):(o=n-k,d<s+o&&(k=n-(k+o),d-=s+o,o=k>d?o+d:o+k));c.css("left",
c.position().left+o)}else"absolute"===k?(n=f.position(),c.css({top:n.top+f.outerHeight(),left:n.left}),j=c.outerHeight(),k=f.offset().top,o=0,o=f.offset().left,u=f.outerWidth(),u=o+u,k=c.offset().left,s=a.width(),s=k+s,l=n.top-j-5,i=d.offset().top+d.height(),t=n.top+f.outerHeight()+j,i=t-i,t=n.top-j,m=d.offset().top,(i>m-t||g.dropup)&&-l<m&&c.css("top",l),o="button-right"===g.align?u-s:o-k,c.css("left",c.position().left+o)):(k=c.height()/2,k>e(q).height()/2&&(k=e(q).height()/2),c.css("marginTop",
-1*k));g.background&&p.background(!0,g.backgroundClassName,g.fade,f);e("div.dt-button-background").on("click.dtb-collection",function(){});e("body").on("click.dtb-collection",function(b){var c=e.fn.addBack?"addBack":"andSelf",d=e(b.target).parent()[0];(!e(b.target).parents()[c]().filter(a).length&&!e(d).hasClass("dt-buttons")||e(b.target).hasClass("dt-button-background"))&&h()}).on("keyup.dtb-collection",function(a){a.keyCode===27&&h()});g.autoClose&&setTimeout(function(){b.on("buttons-action.b-internal",
function(a,b,c,d){d[0]!==f[0]&&h()})},0);e(c).trigger("buttons-popover.dt")}});p.background=function(a,b,c,d){c===m&&(c=400);d||(d=r.body);a?w(e("<div/>").addClass(b).css("display","none").insertAfter(d),c):x(e("div."+b),c,function(){e(this).removeClass(b).remove()})};p.instanceSelector=function(a,b){if(a===m||null===a)return e.map(b,function(a){return a.inst});var c=[],d=e.map(b,function(a){return a.name}),g=function(a){if(Array.isArray(a))for(var h=0,k=a.length;h<k;h++)g(a[h]);else"string"===typeof a?
-1!==a.indexOf(",")?g(a.split(",")):(a=e.inArray(a.trim(),d),-1!==a&&c.push(b[a].inst)):"number"===typeof a&&c.push(b[a].inst)};g(a);return c};p.buttonSelector=function(a,b){for(var c=[],d=function(a,b,c){for(var e,g,f=0,h=b.length;f<h;f++)if(e=b[f])g=c!==m?c+f:f+"",a.push({node:e.node,name:e.conf.name,idx:g}),e.buttons&&d(a,e.buttons,g+"-")},g=function(a,b){var f,h,i=[];d(i,b.s.buttons);f=e.map(i,function(a){return a.node});if(Array.isArray(a)||a instanceof e){f=0;for(h=a.length;f<h;f++)g(a[f],b)}else if(null===
a||a===m||"*"===a){f=0;for(h=i.length;f<h;f++)c.push({inst:b,node:i[f].node})}else if("number"===typeof a)c.push({inst:b,node:b.s.buttons[a].node});else if("string"===typeof a)if(-1!==a.indexOf(",")){i=a.split(",");f=0;for(h=i.length;f<h;f++)g(i[f].trim(),b)}else if(a.match(/^\d+(\-\d+)*$/))f=e.map(i,function(a){return a.idx}),c.push({inst:b,node:i[e.inArray(a,f)].node});else if(-1!==a.indexOf(":name")){var l=a.replace(":name","");f=0;for(h=i.length;f<h;f++)i[f].name===l&&c.push({inst:b,node:i[f].node})}else e(f).filter(a).each(function(){c.push({inst:b,
node:this})});else"object"===typeof a&&a.nodeName&&(i=e.inArray(a,f),-1!==i&&c.push({inst:b,node:f[i]}))},f=0,h=a.length;f<h;f++)g(b,a[f]);return c};p.defaults={buttons:["copy","excel","csv","pdf","print"],name:"main",tabIndex:0,dom:{container:{tag:"div",className:"dt-buttons"},collection:{tag:"div",className:""},button:{tag:"ActiveXObject"in q?"a":"button",className:"dt-button",active:"active",disabled:"disabled"},buttonLiner:{tag:"span",className:""}}};p.version="1.6.5";e.extend(l,{collection:{text:function(a){return a.i18n("buttons.collection",
"Collection")},className:"buttons-collection",init:function(a,b){b.attr("aria-expanded",!1)},action:function(a,b,c,d){a.stopPropagation();d._collection.parents("body").length?this.popover(!1,d):this.popover(d._collection,d)},attr:{"aria-haspopup":!0}},copy:function(a,b){if(l.copyHtml5)return"copyHtml5";if(l.copyFlash&&l.copyFlash.available(a,b))return"copyFlash"},csv:function(a,b){if(l.csvHtml5&&l.csvHtml5.available(a,b))return"csvHtml5";if(l.csvFlash&&l.csvFlash.available(a,b))return"csvFlash"},
excel:function(a,b){if(l.excelHtml5&&l.excelHtml5.available(a,b))return"excelHtml5";if(l.excelFlash&&l.excelFlash.available(a,b))return"excelFlash"},pdf:function(a,b){if(l.pdfHtml5&&l.pdfHtml5.available(a,b))return"pdfHtml5";if(l.pdfFlash&&l.pdfFlash.available(a,b))return"pdfFlash"},pageLength:function(a){var a=a.settings()[0].aLengthMenu,b=Array.isArray(a[0])?a[0]:a,c=Array.isArray(a[0])?a[1]:a;return{extend:"collection",text:function(a){return a.i18n("buttons.pageLength",{"-1":"Show all rows",_:"Show %d rows"},
a.page.len())},className:"buttons-page-length",autoClose:!0,buttons:e.map(b,function(a,b){return{text:c[b],className:"button-page-length",action:function(b,c){c.page.len(a).draw()},init:function(b,c,e){var g=this,c=function(){g.active(b.page.len()===a)};b.on("length.dt"+e.namespace,c);c()},destroy:function(a,b,c){a.off("length.dt"+c.namespace)}}}),init:function(a,b,c){var e=this;a.on("length.dt"+c.namespace,function(){e.text(c.text)})},destroy:function(a,b,c){a.off("length.dt"+c.namespace)}}}});i.Api.register("buttons()",
function(a,b){b===m&&(b=a,a=m);this.selector.buttonGroup=a;var c=this.iterator(!0,"table",function(c){if(c._buttons)return p.buttonSelector(p.instanceSelector(a,c._buttons),b)},!0);c._groupSelector=a;return c});i.Api.register("button()",function(a,b){var c=this.buttons(a,b);1<c.length&&c.splice(1,c.length);return c});i.Api.registerPlural("buttons().active()","button().active()",function(a){return a===m?this.map(function(a){return a.inst.active(a.node)}):this.each(function(b){b.inst.active(b.node,
a)})});i.Api.registerPlural("buttons().action()","button().action()",function(a){return a===m?this.map(function(a){return a.inst.action(a.node)}):this.each(function(b){b.inst.action(b.node,a)})});i.Api.register(["buttons().enable()","button().enable()"],function(a){return this.each(function(b){b.inst.enable(b.node,a)})});i.Api.register(["buttons().disable()","button().disable()"],function(){return this.each(function(a){a.inst.disable(a.node)})});i.Api.registerPlural("buttons().nodes()","button().node()",
function(){var a=e();e(this.each(function(b){a=a.add(b.inst.node(b.node))}));return a});i.Api.registerPlural("buttons().processing()","button().processing()",function(a){return a===m?this.map(function(a){return a.inst.processing(a.node)}):this.each(function(b){b.inst.processing(b.node,a)})});i.Api.registerPlural("buttons().text()","button().text()",function(a){return a===m?this.map(function(a){return a.inst.text(a.node)}):this.each(function(b){b.inst.text(b.node,a)})});i.Api.registerPlural("buttons().trigger()",
"button().trigger()",function(){return this.each(function(a){a.inst.node(a.node).trigger("click")})});i.Api.register("button().popover()",function(a,b){return this.map(function(c){return c.inst._popover(a,this.button(this[0].node),b)})});i.Api.register("buttons().containers()",function(){var a=e(),b=this._groupSelector;this.iterator(!0,"table",function(c){if(c._buttons)for(var c=p.instanceSelector(b,c._buttons),d=0,e=c.length;d<e;d++)a=a.add(c[d].container())});return a});i.Api.register("buttons().container()",
function(){return this.containers().eq(0)});i.Api.register("button().add()",function(a,b){var c=this.context;c.length&&(c=p.instanceSelector(this._groupSelector,c[0]._buttons),c.length&&c[0].add(b,a));return this.button(this._groupSelector,a)});i.Api.register("buttons().destroy()",function(){this.pluck("inst").unique().each(function(a){a.destroy()});return this});i.Api.registerPlural("buttons().remove()","buttons().remove()",function(){this.each(function(a){a.inst.remove(a.node)});return this});var v;
i.Api.register("buttons.info()",function(a,b,c){var d=this;if(!1===a)return this.off("destroy.btn-info"),x(e("#datatables_buttons_info"),400,function(){e(this).remove()}),clearTimeout(v),v=null,this;v&&clearTimeout(v);e("#datatables_buttons_info").length&&e("#datatables_buttons_info").remove();w(e('<div id="datatables_buttons_info" class="dt-button-info"/>').html(a?"<h2>"+a+"</h2>":"").append(e("<div/>")["string"===typeof b?"html":"append"](b)).css("display","none").appendTo("body"));c!==m&&0!==c&&
(v=setTimeout(function(){d.buttons.info(!1)},c));this.on("destroy.btn-info",function(){d.buttons.info(!1)});return this});i.Api.register("buttons.exportData()",function(a){if(this.context.length){var b=new i.Api(this.context[0]),c=e.extend(!0,{},{rows:null,columns:"",modifier:{search:"applied",order:"applied"},orthogonal:"display",stripHtml:!0,stripNewlines:!0,decodeEntities:!0,trim:!0,format:{header:function(a){return d(a)},footer:function(a){return d(a)},body:function(a){return d(a)}},customizeData:null},
a),d=function(a){if("string"!==typeof a)return a;a=a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");a=a.replace(/<!\-\-.*?\-\->/g,"");c.stripHtml&&(a=a.replace(/<([^>'"]*('[^']*'|"[^"]*")?)*>/g,""));c.trim&&(a=a.replace(/^\s+|\s+$/g,""));c.stripNewlines&&(a=a.replace(/\n/g," "));c.decodeEntities&&(A.innerHTML=a,a=A.value);return a},a=b.columns(c.columns).indexes().map(function(a){var d=b.column(a).header();return c.format.header(d.innerHTML,a,d)}).toArray(),g=b.table().footer()?
b.columns(c.columns).indexes().map(function(a){var d=b.column(a).footer();return c.format.footer(d?d.innerHTML:"",a,d)}).toArray():null,f=e.extend({},c.modifier);b.select&&"function"===typeof b.select.info&&f.selected===m&&b.rows(c.rows,e.extend({selected:!0},f)).any()&&e.extend(f,{selected:!0});for(var f=b.rows(c.rows,f).indexes().toArray(),h=b.cells(f,c.columns),f=h.render(c.orthogonal).toArray(),h=h.nodes().toArray(),k=a.length,n=[],j=0,l=0,p=0<k?f.length/k:0;l<p;l++){for(var r=[k],q=0;q<k;q++)r[q]=
c.format.body(f[j],l,q,h[j]),j++;n[l]=r}a={header:a,footer:g,body:n};c.customizeData&&c.customizeData(a);return a}});i.Api.register("buttons.exportInfo()",function(a){a||(a={});var b;var c=a;b="*"===c.filename&&"*"!==c.title&&c.title!==m&&null!==c.title&&""!==c.title?c.title:c.filename;"function"===typeof b&&(b=b());b===m||null===b?b=null:(-1!==b.indexOf("*")&&(b=b.replace("*",e("head > title").text()).trim()),b=b.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,""),(c=y(c.extension))||(c=""),b+=
c);c=y(a.title);c=null===c?null:-1!==c.indexOf("*")?c.replace("*",e("head > title").text()||"Exported data"):c;return{filename:b,title:c,messageTop:B(this,a.message||a.messageTop,"top"),messageBottom:B(this,a.messageBottom,"bottom")}});var y=function(a){return null===a||a===m?null:"function"===typeof a?a():a},B=function(a,b,c){b=y(b);if(null===b)return null;a=e("caption",a.table().container()).eq(0);return"*"===b?a.css("caption-side")!==c?null:a.length?a.text():"":b},A=e("<textarea/>")[0];e.fn.dataTable.Buttons=
p;e.fn.DataTable.Buttons=p;e(r).on("init.dt plugin-init.dt",function(a,b){if("dt"===a.namespace){var c=b.oInit.buttons||i.defaults.buttons;c&&!b._buttons&&(new p(b,c)).container()}});i.ext.feature.push({fnInit:z,cFeature:"B"});i.ext.features&&i.ext.features.register("buttons",z);return p});

/*!
 Bootstrap integration for DataTables' Buttons
 ©2016 SpryMedia Ltd - datatables.net/license
*/
(function(b){"function"===typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-buttons"],function(a){return b(a,window,document)}):"object"===typeof exports?module.exports=function(a,c){a||(a=window);if(!c||!c.fn.dataTable)c=require("datatables.net-bs4")(a,c).$;c.fn.dataTable.Buttons||require("datatables.net-buttons")(a,c);return b(c,a,a.document)}:b(jQuery,window,document)})(function(b){var a=b.fn.dataTable;b.extend(!0,a.Buttons.defaults,{dom:{container:{className:"dt-buttons btn-group flex-wrap"},
button:{className:"btn btn-secondary"},collection:{tag:"div",className:"dropdown-menu",button:{tag:"a",className:"dt-button dropdown-item",active:"active",disabled:"disabled"}}},buttonCreated:function(a,d){return a.buttons?b('<div class="btn-group"/>').append(d):d}});a.ext.buttons.collection.className+=" dropdown-toggle";a.ext.buttons.collection.rightAlignClassName="dropdown-menu-right";return a.Buttons});

/*!
 * Column visibility buttons for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


$.extend( DataTable.ext.buttons, {
	// A collection of column visibility buttons
	colvis: function ( dt, conf ) {
		return {
			extend: 'collection',
			text: function ( dt ) {
				return dt.i18n( 'buttons.colvis', 'Column visibility' );
			},
			className: 'buttons-colvis',
			buttons: [ {
				extend: 'columnsToggle',
				columns: conf.columns,
				columnText: conf.columnText
			} ]
		};
	},

	// Selected columns with individual buttons - toggle column visibility
	columnsToggle: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnToggle',
				columns: idx,
				columnText: conf.columnText
			};
		} ).toArray();

		return columns;
	},

	// Single button to toggle column visibility
	columnToggle: function ( dt, conf ) {
		return {
			extend: 'columnVisibility',
			columns: conf.columns,
			columnText: conf.columnText
		};
	},

	// Selected columns with individual buttons - set column visibility
	columnsVisibility: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnVisibility',
				columns: idx,
				visibility: conf.visibility,
				columnText: conf.columnText
			};
		} ).toArray();

		return columns;
	},

	// Single button to set column visibility
	columnVisibility: {
		columns: undefined, // column selector
		text: function ( dt, button, conf ) {
			return conf._columnText( dt, conf );
		},
		className: 'buttons-columnVisibility',
		action: function ( e, dt, button, conf ) {
			var col = dt.columns( conf.columns );
			var curr = col.visible();

			col.visible( conf.visibility !== undefined ?
				conf.visibility :
				! (curr.length ? curr[0] : false )
			);
		},
		init: function ( dt, button, conf ) {
			var that = this;
			button.attr( 'data-cv-idx', conf.columns );

			dt
				.on( 'column-visibility.dt'+conf.namespace, function (e, settings) {
					if ( ! settings.bDestroying && settings.nTable == dt.settings()[0].nTable ) {
						that.active( dt.column( conf.columns ).visible() );
					}
				} )
				.on( 'column-reorder.dt'+conf.namespace, function (e, settings, details) {
					if ( dt.columns( conf.columns ).count() !== 1 ) {
						return;
					}

					// This button controls the same column index but the text for the column has
					// changed
					that.text( conf._columnText( dt, conf ) );

					// Since its a different column, we need to check its visibility
					that.active( dt.column( conf.columns ).visible() );
				} );

			this.active( dt.column( conf.columns ).visible() );
		},
		destroy: function ( dt, button, conf ) {
			dt
				.off( 'column-visibility.dt'+conf.namespace )
				.off( 'column-reorder.dt'+conf.namespace );
		},

		_columnText: function ( dt, conf ) {
			// Use DataTables' internal data structure until this is presented
			// is a public API. The other option is to use
			// `$( column(col).node() ).text()` but the node might not have been
			// populated when Buttons is constructed.
			var idx = dt.column( conf.columns ).index();
			var title = dt.settings()[0].aoColumns[ idx ].sTitle;

			if (! title) {
				title = dt.column(idx).header().innerHTML;
			}

			title = title
				.replace(/\n/g," ")        // remove new lines
				.replace(/<br\s*\/?>/gi, " ")  // replace line breaks with spaces
				.replace(/<select(.*?)<\/select>/g, "") // remove select tags, including options text
				.replace(/<!\-\-.*?\-\->/g, "") // strip HTML comments
				.replace(/<.*?>/g, "")   // strip HTML
				.replace(/^\s+|\s+$/g,""); // trim

			return conf.columnText ?
				conf.columnText( dt, idx, title ) :
				title;
		}
	},


	colvisRestore: {
		className: 'buttons-colvisRestore',

		text: function ( dt ) {
			return dt.i18n( 'buttons.colvisRestore', 'Restore visibility' );
		},

		init: function ( dt, button, conf ) {
			conf._visOriginal = dt.columns().indexes().map( function ( idx ) {
				return dt.column( idx ).visible();
			} ).toArray();
		},

		action: function ( e, dt, button, conf ) {
			dt.columns().every( function ( i ) {
				// Take into account that ColReorder might have disrupted our
				// indexes
				var idx = dt.colReorder && dt.colReorder.transpose ?
					dt.colReorder.transpose( i, 'toOriginal' ) :
					i;

				this.visible( conf._visOriginal[ idx ] );
			} );
		}
	},


	colvisGroup: {
		className: 'buttons-colvisGroup',

		action: function ( e, dt, button, conf ) {
			dt.columns( conf.show ).visible( true, false );
			dt.columns( conf.hide ).visible( false, false );

			dt.columns.adjust();
		},

		show: [],

		hide: []
	}
} );


return DataTable.Buttons;
}));

/*!
 * Flash export buttons for Buttons and DataTables.
 * 2015-2017 SpryMedia Ltd - datatables.net/license
 *
 * ZeroClipbaord - MIT license
 * Copyright (c) 2012 Joseph Huckaby
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ZeroClipboard dependency
 */

/*
 * ZeroClipboard 1.0.4 with modifications
 * Author: Joseph Huckaby
 * License: MIT
 *
 * Copyright (c) 2012 Joseph Huckaby
 */
var ZeroClipboard_TableTools = {
	version: "1.0.4-TableTools2",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: '', // URL to movie
	nextId: 1, // ID of next movie

	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') {
			thingy = document.getElementById(thingy);
		}
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				this.className = this.className.replace( new RegExp("\\s*" + name + "\\s*"), " ").replace(/^\s+/, '').replace(/\s+$/, '');
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			};
		}
		return thingy;
	},

	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},

	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},

	log: function ( str ) {
		console.log( 'Flash: '+str );
	},

	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},

	getDOMObjectPosition: function(obj) {
		// get absolute coordinates for dom element
		var info = {
			left: 0,
			top: 0,
			width: obj.width ? obj.width : obj.offsetWidth,
			height: obj.height ? obj.height : obj.offsetHeight
		};

		if ( obj.style.width !== "" ) {
			info.width = obj.style.width.replace("px","");
		}

		if ( obj.style.height !== "" ) {
			info.height = obj.style.height.replace("px","");
		}

		while (obj) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return info;
	},

	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};

		// unique ID
		this.id = ZeroClipboard_TableTools.nextId++;
		this.movieId = 'ZeroClipboard_TableToolsMovie_' + this.id;

		// register client with singleton to receive flash events
		ZeroClipboard_TableTools.register(this.id, this);

		// create movie
		if (elem) {
			this.glue(elem);
		}
	}
};

ZeroClipboard_TableTools.Client.prototype = {

	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	fileName: '', // default file save name
	action: 'copy', // action to perform
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	sized: false,
	sheetName: '', // default sheet name for excel export

	glue: function(elem, title) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard_TableTools.$(elem);

		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 99;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
		}

		// find X/Y position of domElement
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);

		// create floating DIV above element
		this.div = document.createElement('div');
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '0px';
		style.top = '0px';
		style.width = (box.width) + 'px';
		style.height = box.height + 'px';
		style.zIndex = zIndex;

		if ( typeof title != "undefined" && title !== "" ) {
			this.div.title = title;
		}
		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		}

		// style.backgroundColor = '#f00'; // debug
		if ( this.domElement ) {
			this.domElement.appendChild(this.div);
			this.div.innerHTML = this.getHTML( box.width, box.height ).replace(/&/g, '&amp;');
		}
	},

	positionElement: function() {
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
		var style = this.div.style;

		style.position = 'absolute';
		//style.left = (this.domElement.offsetLeft)+'px';
		//style.top = this.domElement.offsetTop+'px';
		style.width = box.width + 'px';
		style.height = box.height + 'px';

		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		} else {
			return;
		}

		var flash = this.div.childNodes[0];
		flash.width = box.width;
		flash.height = box.height;
	},

	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id +
			'&width=' + width +
			'&height=' + height;

		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},

	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},

	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},

	destroy: function() {
		// destroy control and floater
		var that = this;

		if (this.domElement && this.div) {
			$(this.div).remove();

			this.domElement = null;
			this.div = null;

			$.each( ZeroClipboard_TableTools.clients, function ( id, client ) {
				if ( client === that ) {
					delete ZeroClipboard_TableTools.clients[ id ];
				}
			} );
		}
	},

	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard_TableTools.$(elem);
			if (!this.domElement) {
				this.hide();
			}
		}

		if (this.domElement && this.div) {
			var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},

	clearText: function() {
		// clear the text to be copy / saved
		this.clipText = '';
		if (this.ready) {
			this.movie.clearText();
		}
	},

	appendText: function(newText) {
		// append text to that which is to be copied / saved
		this.clipText += newText;
		if (this.ready) { this.movie.appendText(newText) ;}
	},

	setText: function(newText) {
		// set text to be copied to be copied / saved
		this.clipText = newText;
		if (this.ready) { this.movie.setText(newText) ;}
	},

	setFileName: function(newText) {
		// set the file name
		this.fileName = newText;
		if (this.ready) {
			this.movie.setFileName(newText);
		}
	},

	setSheetData: function(data) {
		// set the xlsx sheet data
		if (this.ready) {
			this.movie.setSheetData( JSON.stringify( data ) );
		}
	},

	setAction: function(newText) {
		// set action (save or copy)
		this.action = newText;
		if (this.ready) {
			this.movie.setAction(newText);
		}
	},

	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		this.handlers[eventName].push(func);
	},

	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) {
			this.movie.setHandCursor(enabled);
		}
	},

	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},

	receiveEvent: function(eventName, args) {
		var self;

		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');

		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}

				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}

				this.ready = true;
				this.movie.clearText();
				this.movie.appendText( this.clipText );
				this.movie.setFileName( this.fileName );
				this.movie.setAction( this.action );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;

			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					//this.domElement.addClass('hover');
					if (this.recoverActive) {
						this.domElement.addClass('active');
					}
				}
				break;

			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					//this.domElement.removeClass('hover');
				}
				break;

			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;

			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName

		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];

				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
};

ZeroClipboard_TableTools.hasFlash = function ()
{
	try {
		var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		if (fo) {
			return true;
		}
	}
	catch (e) {
		if (
			navigator.mimeTypes &&
			navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
			navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin
		) {
			return true;
		}
	}

	return false;
};

// For the Flash binding to work, ZeroClipboard_TableTools must be on the global
// object list
window.ZeroClipboard_TableTools = ZeroClipboard_TableTools;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * If a Buttons instance is initlaised before it is placed into the DOM, Flash
 * won't be able to bind to it, so we need to wait until it is available, this
 * method abstracts that out.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {jQuery} node  Button
 */
var _glue = function ( flash, node )
{
	var id = node.attr('id');

	if ( node.parents('html').length ) {
		flash.glue( node[0], '' );
	}
	else {
		setTimeout( function () {
			_glue( flash, node );
		}, 500 );
	}
};

/**
 * Get the sheet name for Excel exports.
 *
 * @param {object}  config       Button configuration
 */
var _sheetname = function ( config )
{
	var sheetName = 'Sheet1';

	if ( config.sheetName ) {
		sheetName = config.sheetName.replace(/[\[\]\*\/\\\?\:]/g, '');
	}

	return sheetName;
};

/**
 * Set the flash text. This has to be broken up into chunks as the Javascript /
 * Flash bridge has a size limit. There is no indication in the Flash
 * documentation what this is, and it probably depends upon the browser.
 * Experimentation shows that the point is around 50k when data starts to get
 * lost, so an 8K limit used here is safe.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {string}        data  Data to send to Flash
 */
var _setText = function ( flash, data )
{
	var parts = data.match(/[\s\S]{1,8192}/g) || [];

	flash.clearText();
	for ( var i=0, len=parts.length ; i<len ; i++ )
	{
		flash.appendText( parts[i] );
	}
};

/**
 * Get the newline character(s)
 *
 * @param {object}  config Button configuration
 * @return {string}        Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param  {DataTable.Api} dt     DataTables API instance
 * @param  {object}        config Button configuration
 * @return {object}               The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var boundary = config.fieldBoundary;
	var separator = config.fieldSeparator;
	var reBoundary = new RegExp( boundary, 'g' );
	var escapeChar = config.escapeChar !== undefined ?
		config.escapeChar :
		'\\';
	var join = function ( a ) {
		var s = '';

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + ('' + a[i]).replace( reBoundary, escapeChar+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer && data.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};


// Basic initialisation for the buttons is common between them
var flashButton = {
	available: function () {
		return ZeroClipboard_TableTools.hasFlash();
	},

	init: function ( dt, button, config ) {
		// Insert the Flash movie
		ZeroClipboard_TableTools.moviePath = DataTable.Buttons.swfPath;
		var flash = new ZeroClipboard_TableTools.Client();

		flash.setHandCursor( true );
		flash.addEventListener('mouseDown', function(client) {
			config._fromFlash = true;
			dt.button( button[0] ).trigger();
			config._fromFlash = false;
		} );

		_glue( flash, button );

		config._flash = flash;
	},

	destroy: function ( dt, button, config ) {
		config._flash.destroy();
	},

	fieldSeparator: ',',

	fieldBoundary: '"',

	exportOptions: {},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	filename: '*',

	extension: '.csv',

	header: true,

	footer: false
};


/**
 * Convert from numeric position to letter for column names in Excel
 * @param  {int} n Column number
 * @return {string} Column letter(s) name
 */
function createCellPos( n ){
	var ordA = 'A'.charCodeAt(0);
	var ordZ = 'Z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
	var s = "";

	while( n >= 0 ) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}

	return s;
}

/**
 * Create an XML node and add any children, attributes, etc without needing to
 * be verbose in the DOM.
 *
 * @param  {object} doc      XML document
 * @param  {string} nodeName Node name
 * @param  {object} opts     Options - can be `attr` (attributes), `children`
 *   (child nodes) and `text` (text content)
 * @return {node}            Created node
 */
function _createNode( doc, nodeName, opts ){
	var tempNode = doc.createElement( nodeName );

	if ( opts ) {
		if ( opts.attr ) {
			$(tempNode).attr( opts.attr );
		}

		if ( opts.children ) {
			$.each( opts.children, function ( key, value ) {
				tempNode.appendChild( value );
			} );
		}

		if ( opts.text !== null && opts.text !== undefined ) {
			tempNode.appendChild( doc.createTextNode( opts.text ) );
		}
	}

	return tempNode;
}

/**
 * Get the width for an Excel column based on the contents of that column
 * @param  {object} data Data for export
 * @param  {int}    col  Column index
 * @return {int}         Column width
 */
function _excelColWidth( data, col ) {
	var max = data.header[col].length;
	var len, lineSplit, str;

	if ( data.footer && data.footer[col].length > max ) {
		max = data.footer[col].length;
	}

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var point = data.body[i][col];
		str = point !== null && point !== undefined ?
			point.toString() :
			'';

		// If there is a newline character, workout the width of the column
		// based on the longest line in the string
		if ( str.indexOf('\n') !== -1 ) {
			lineSplit = str.split('\n');
			lineSplit.sort( function (a, b) {
				return b.length - a.length;
			} );

			len = lineSplit[0].length;
		}
		else {
			len = str.length;
		}

		if ( len > max ) {
			max = len;
		}

		// Max width rather than having potentially massive column widths
		if ( max > 40 ) {
			return 52; // 40 * 1.3
		}
	}

	max *= 1.3;

	// And a min width
	return max > 6 ? max : 6;
}

  var _serialiser = "";
    if (typeof window.XMLSerializer === 'undefined') {
        _serialiser = new function () {
            this.serializeToString = function (input) {
                return input.xml
            }
        };
    } else {
        _serialiser =  new XMLSerializer();
    }

    var _ieExcel;


/**
 * Convert XML documents in an object to strings
 * @param  {object} obj XLSX document object
 */
function _xlsxToStrings( obj ) {
	if ( _ieExcel === undefined ) {
		// Detect if we are dealing with IE's _awful_ serialiser by seeing if it
		// drop attributes
		_ieExcel = _serialiser
			.serializeToString(
				$.parseXML( excelStrings['xl/worksheets/sheet1.xml'] )
			)
			.indexOf( 'xmlns:r' ) === -1;
	}

	$.each( obj, function ( name, val ) {
		if ( $.isPlainObject( val ) ) {
			_xlsxToStrings( val );
		}
		else {
			if ( _ieExcel ) {
				// IE's XML serialiser will drop some name space attributes from
				// from the root node, so we need to save them. Do this by
				// replacing the namespace nodes with a regular attribute that
				// we convert back when serialised. Edge does not have this
				// issue
				var worksheet = val.childNodes[0];
				var i, ien;
				var attrs = [];

				for ( i=worksheet.attributes.length-1 ; i>=0 ; i-- ) {
					var attrName = worksheet.attributes[i].nodeName;
					var attrValue = worksheet.attributes[i].nodeValue;

					if ( attrName.indexOf( ':' ) !== -1 ) {
						attrs.push( { name: attrName, value: attrValue } );

						worksheet.removeAttribute( attrName );
					}
				}

				for ( i=0, ien=attrs.length ; i<ien ; i++ ) {
					var attr = val.createAttribute( attrs[i].name.replace( ':', '_dt_b_namespace_token_' ) );
					attr.value = attrs[i].value;
					worksheet.setAttributeNode( attr );
				}
			}

			var str = _serialiser.serializeToString(val);

			// Fix IE's XML
			if ( _ieExcel ) {
				// IE doesn't include the XML declaration
				if ( str.indexOf( '<?xml' ) === -1 ) {
					str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;
				}

				// Return namespace attributes to being as such
				str = str.replace( /_dt_b_namespace_token_/g, ':' );
			}

			// Safari, IE and Edge will put empty name space attributes onto
			// various elements making them useless. This strips them out
			str = str.replace( /<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>' );

			obj[ name ] = str;
		}
	} );
}

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
	"_rels/.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
		'</Relationships>',

	"xl/_rels/workbook.xml.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
		'</Relationships>',

	"[Content_Types].xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
			'<Default Extension="xml" ContentType="application/xml" />'+
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
			'<Default Extension="jpeg" ContentType="image/jpeg" />'+
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
		'</Types>',

	"xl/workbook.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
			'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
			'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
			'<bookViews>'+
				'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
			'</bookViews>'+
			'<sheets>'+
				'<sheet name="" sheetId="1" r:id="rId1"/>'+
			'</sheets>'+
		'</workbook>',

	"xl/worksheets/sheet1.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<sheetData/>'+
			'<mergeCells count="0"/>'+
		'</worksheet>',

	"xl/styles.xml":
		'<?xml version="1.0" encoding="UTF-8"?>'+
		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<numFmts count="6">'+
				'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
				'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
				'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
				'<numFmt numFmtId="167" formatCode="0.0%"/>'+
				'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
				'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
			'</numFmts>'+
			'<fonts count="5" x14ac:knownFonts="1">'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<color rgb="FFFFFFFF" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<b />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<i />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<u />'+
				'</font>'+
			'</fonts>'+
			'<fills count="6">'+
				'<fill>'+
					'<patternFill patternType="none" />'+
				'</fill>'+
				'<fill>'+ // Excel appears to use this as a dotted background regardless of values but
					'<patternFill patternType="none" />'+ // to be valid to the schema, use a patternFill
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD9D9D9" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD99795" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6efce" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6cfef" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
			'</fills>'+
			'<borders count="2">'+
				'<border>'+
					'<left />'+
					'<right />'+
					'<top />'+
					'<bottom />'+
					'<diagonal />'+
				'</border>'+
				'<border diagonalUp="false" diagonalDown="false">'+
					'<left style="thin">'+
						'<color auto="1" />'+
					'</left>'+
					'<right style="thin">'+
						'<color auto="1" />'+
					'</right>'+
					'<top style="thin">'+
						'<color auto="1" />'+
					'</top>'+
					'<bottom style="thin">'+
						'<color auto="1" />'+
					'</bottom>'+
					'<diagonal />'+
				'</border>'+
			'</borders>'+
			'<cellStyleXfs count="1">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
			'</cellStyleXfs>'+
			'<cellXfs count="61">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="left"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="center"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="right"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="fill"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment textRotation="90"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment wrapText="1"/>'+
				'</xf>'+
				'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
			'</cellXfs>'+
			'<cellStyles count="1">'+
				'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
			'</cellStyles>'+
			'<dxfs count="0" />'+
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
		'</styleSheet>'
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
var _excelSpecials = [
	{ match: /^\-?\d+\.\d%$/,       style: 60, fmt: function (d) { return d/100; } }, // Precent with d.p.
	{ match: /^\-?\d+\.?\d*%$/,     style: 56, fmt: function (d) { return d/100; } }, // Percent
	{ match: /^\-?\$[\d,]+.?\d*$/,  style: 57 }, // Dollars
	{ match: /^\-?£[\d,]+.?\d*$/,   style: 58 }, // Pounds
	{ match: /^\-?€[\d,]+.?\d*$/,   style: 59 }, // Euros
	{ match: /^\([\d,]+\)$/,        style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
	{ match: /^\([\d,]+\.\d{2}\)$/, style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
	{ match: /^[\d,]+$/,            style: 63 }, // Numbers with thousand separators
	{ match: /^[\d,]+\.\d{2}$/,     style: 64 }  // Numbers with 2d.p. and thousands separators
];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables options and methods
 */

// Set the default SWF path
DataTable.Buttons.swfPath = '//cdn.datatables.net/buttons/'+DataTable.Buttons.version+'/swf/flashExport.swf';

// Method to allow Flash buttons to be resized when made visible - as they are
// of zero height and width if initialised hidden
DataTable.Api.register( 'buttons.resize()', function () {
	$.each( ZeroClipboard_TableTools.clients, function ( i, client ) {
		if ( client.domElement !== undefined && client.domElement.parentNode ) {
			client.positionElement();
		}
	} );
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Button definitions
 */

// Copy to clipboard
DataTable.ext.buttons.copyFlash = $.extend( {}, flashButton, {
	className: 'buttons-copy buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		// Check that the trigger did actually occur due to a Flash activation
		if ( ! config._fromFlash ) {
			return;
		}

		this.processing( true );

		var flash = config._flash;
		var exportData = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var newline = _newLine(config);
		var output = exportData.str;

		if ( info.title ) {
			output = info.title + newline + newline + output;
		}

		if ( info.messageTop ) {
			output = info.messageTop + newline + newline + output;
		}

		if ( info.messageBottom ) {
			output = output + newline + newline + info.messageBottom;
		}

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		flash.setAction( 'copy' );
		_setText( flash, output );

		this.processing( false );

		dt.buttons.info(
			dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
			dt.i18n( 'buttons.copySuccess', {
				_: 'Copied %d rows to clipboard',
				1: 'Copied 1 row to clipboard'
			}, data.rows ),
			3000
		);
	},

	fieldSeparator: '\t',

	fieldBoundary: ''
} );

// CSV save file
DataTable.ext.buttons.csvFlash = $.extend( {}, flashButton, {
	className: 'buttons-csv buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var flash = config._flash;
		var data = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var output = config.customize ?
			config.customize( data.str, config, dt ) :
			data.str;

		flash.setAction( 'csv' );
		flash.setFileName( info.filename );
		_setText( flash, output );
	},

	escapeChar: '"'
} );

// Excel save file - this is really a CSV file using UTF-8 that Excel can read
DataTable.ext.buttons.excelFlash = $.extend( {}, flashButton, {
	className: 'buttons-excel buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var flash = config._flash;
		var rowPos = 0;
		var rels = $.parseXML( excelStrings['xl/worksheets/sheet1.xml'] ) ; //Parses xml
		var relsGet = rels.getElementsByTagName( "sheetData" )[0];

		var xlsx = {
			_rels: {
				".rels": $.parseXML( excelStrings['_rels/.rels'] )
			},
			xl: {
				_rels: {
					"workbook.xml.rels": $.parseXML( excelStrings['xl/_rels/workbook.xml.rels'] )
				},
				"workbook.xml": $.parseXML( excelStrings['xl/workbook.xml'] ),
				"styles.xml": $.parseXML( excelStrings['xl/styles.xml'] ),
				"worksheets": {
					"sheet1.xml": rels
				}

			},
			"[Content_Types].xml": $.parseXML( excelStrings['[Content_Types].xml'])
		};

		var data = dt.buttons.exportData( config.exportOptions );
		var currentRow, rowNode;
		var addRow = function ( row ) {
			currentRow = rowPos+1;
			rowNode = _createNode( rels, "row", { attr: {r:currentRow} } );

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				// Concat both the Cell Columns as a letter and the Row of the cell.
				var cellId = createCellPos(i) + '' + currentRow;
				var cell = null;

				// For null, undefined of blank cell, continue so it doesn't create the _createNode
				if ( row[i] === null || row[i] === undefined || row[i] === '' ) {
					if ( config.createEmptyCells === true ) {
						row[i] = '';
					}
					else {
						continue;
					}
				}

				row[i] = typeof row[i].trim === 'function'
					? row[i].trim()
					: row[i];

				// Special number formatting options
				for ( var j=0, jen=_excelSpecials.length ; j<jen ; j++ ) {
					var special = _excelSpecials[j];

					// TODO Need to provide the ability for the specials to say
					// if they are returning a string, since at the moment it is
					// assumed to be a number
					if ( row[i].match && ! row[i].match(/^0\d+/) && row[i].match( special.match ) ) {
						var val = row[i].replace(/[^\d\.\-]/g, '');

						if ( special.fmt ) {
							val = special.fmt( val );
						}

						cell = _createNode( rels, 'c', {
							attr: {
								r: cellId,
								s: special.style
							},
							children: [
								_createNode( rels, 'v', { text: val } )
							]
						} );

						break;
					}
				}

				if ( ! cell ) {
					if ( typeof row[i] === 'number' || (
						row[i].match &&
						row[i].match(/^-?\d+(\.\d+)?$/) &&
						! row[i].match(/^0\d+/) )
					) {
						// Detect numbers - don't match numbers with leading zeros
						// or a negative anywhere but the start
						cell = _createNode( rels, 'c', {
							attr: {
								t: 'n',
								r: cellId
							},
							children: [
								_createNode( rels, 'v', { text: row[i] } )
							]
						} );
					}
					else {
						// String output - replace non standard characters for text output
						var text = ! row[i].replace ?
							row[i] :
							row[i].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

						cell = _createNode( rels, 'c', {
							attr: {
								t: 'inlineStr',
								r: cellId
							},
							children:{
								row: _createNode( rels, 'is', {
									children: {
										row: _createNode( rels, 't', {
											text: text
										} )
									}
								} )
							}
						} );
					}
				}

				rowNode.appendChild( cell );
			}

			relsGet.appendChild(rowNode);
			rowPos++;
		};

		$( 'sheets sheet', xlsx.xl['workbook.xml'] ).attr( 'name', _sheetname( config ) );

		if ( config.customizeData ) {
			config.customizeData( data );
		}

		var mergeCells = function ( row, colspan ) {
			var mergeCells = $('mergeCells', rels);

			mergeCells[0].appendChild( _createNode( rels, 'mergeCell', {
				attr: {
					ref: 'A'+row+':'+createCellPos(colspan)+row
				}
			} ) );
			mergeCells.attr( 'count', mergeCells.attr( 'count' )+1 );
			$('row:eq('+(row-1)+') c', rels).attr( 's', '51' ); // centre
		};

		// Title and top messages
		var exportInfo = dt.buttons.exportInfo( config );
		if ( exportInfo.title ) {
			addRow( [exportInfo.title], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		if ( exportInfo.messageTop ) {
			addRow( [exportInfo.messageTop], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Table itself
		if ( config.header ) {
			addRow( data.header, rowPos );
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		for ( var n=0, ie=data.body.length ; n<ie ; n++ ) {
			addRow( data.body[n], rowPos );
		}

		if ( config.footer && data.footer ) {
			addRow( data.footer, rowPos);
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		// Below the table
		if ( exportInfo.messageBottom ) {
			addRow( [exportInfo.messageBottom], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Set column widths
		var cols = _createNode( rels, 'cols' );
		$('worksheet', rels).prepend( cols );

		for ( var i=0, ien=data.header.length ; i<ien ; i++ ) {
			cols.appendChild( _createNode( rels, 'col', {
				attr: {
					min: i+1,
					max: i+1,
					width: _excelColWidth( data, i ),
					customWidth: 1
				}
			} ) );
		}

		// Let the developer customise the document if they want to
		if ( config.customize ) {
			config.customize( xlsx, config, dt );
		}

		_xlsxToStrings( xlsx );

		flash.setAction( 'excel' );
		flash.setFileName( exportInfo.filename );
		flash.setSheetData( xlsx );
		_setText( flash, '' );

		this.processing( false );
	},

	extension: '.xlsx',
	
	createEmptyCells: false
} );



// PDF export
DataTable.ext.buttons.pdfFlash = $.extend( {}, flashButton, {
	className: 'buttons-pdf buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		// Set the text
		var flash = config._flash;
		var data = dt.buttons.exportData( config.exportOptions );
		var info = dt.buttons.exportInfo( config );
		var totalWidth = dt.table().node().offsetWidth;

		// Calculate the column width ratios for layout of the table in the PDF
		var ratios = dt.columns( config.columns ).indexes().map( function ( idx ) {
			return dt.column( idx ).header().offsetWidth / totalWidth;
		} );

		flash.setAction( 'pdf' );
		flash.setFileName( info.filename );

		_setText( flash, JSON.stringify( {
			title:         info.title || '',
			messageTop:    info.messageTop || '',
			messageBottom: info.messageBottom || '',
			colWidth:      ratios.toArray(),
			orientation:   config.orientation,
			size:          config.pageSize,
			header:        config.header ? data.header : null,
			footer:        config.footer ? data.footer : null,
			body:          data.body
		} ) );

		this.processing( false );
	},

	extension: '.pdf',

	orientation: 'portrait',

	pageSize: 'A4',

	newline: '\n'
} );


return DataTable.Buttons;
}));

/*!
 * HTML5 export buttons for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 *
 * FileSaver.js (1.3.3) - MIT license
 * Copyright © 2016 Eli Grey - http://eligrey.com
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $, jszip, pdfmake) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document, jszip, pdfmake );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, jszip, pdfmake, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

// Allow the constructor to pass in JSZip and PDFMake from external requires.
// Otherwise, use globally defined variables, if they are available.
function _jsZip () {
	return jszip || window.JSZip;
}
function _pdfMake () {
	return pdfmake || window.pdfMake;
}

DataTable.Buttons.pdfMake = function (_) {
	if ( ! _ ) {
		return _pdfMake();
	}
	pdfmake = _;
}

DataTable.Buttons.jszip = function (_) {
	if ( ! _ ) {
		return _jsZip();
	}
	jszip = _;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FileSaver.js dependency
 */

/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

var _saveAs = (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));


// Expose file saver on the DataTables API. Can't attach to `DataTables.Buttons`
// since this file can be loaded before Button's core!
DataTable.fileSave = _saveAs;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * Get the sheet name for Excel exports.
 *
 * @param {object}	config Button configuration
 */
var _sheetname = function ( config )
{
	var sheetName = 'Sheet1';

	if ( config.sheetName ) {
		sheetName = config.sheetName.replace(/[\[\]\*\/\\\?\:]/g, '');
	}

	return sheetName;
};

/**
 * Get the newline character(s)
 *
 * @param {object}	config Button configuration
 * @return {string}				Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param	{DataTable.Api} dt		 DataTables API instance
 * @param	{object}				config Button configuration
 * @return {object}							 The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var boundary = config.fieldBoundary;
	var separator = config.fieldSeparator;
	var reBoundary = new RegExp( boundary, 'g' );
	var escapeChar = config.escapeChar !== undefined ?
		config.escapeChar :
		'\\';
	var join = function ( a ) {
		var s = '';

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + ('' + a[i]).replace( reBoundary, escapeChar+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer && data.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};

/**
 * Older versions of Safari (prior to tech preview 18) don't support the
 * download option required.
 *
 * @return {Boolean} `true` if old Safari
 */
var _isDuffSafari = function ()
{
	var safari = navigator.userAgent.indexOf('Safari') !== -1 &&
		navigator.userAgent.indexOf('Chrome') === -1 &&
		navigator.userAgent.indexOf('Opera') === -1;

	if ( ! safari ) {
		return false;
	}

	var version = navigator.userAgent.match( /AppleWebKit\/(\d+\.\d+)/ );
	if ( version && version.length > 1 && version[1]*1 < 603.1 ) {
		return true;
	}

	return false;
};

/**
 * Convert from numeric position to letter for column names in Excel
 * @param  {int} n Column number
 * @return {string} Column letter(s) name
 */
function createCellPos( n ){
	var ordA = 'A'.charCodeAt(0);
	var ordZ = 'Z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
	var s = "";

	while( n >= 0 ) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}

	return s;
}

try {
	var _serialiser = new XMLSerializer();
	var _ieExcel;
}
catch (t) {}

/**
 * Recursively add XML files from an object's structure to a ZIP file. This
 * allows the XSLX file to be easily defined with an object's structure matching
 * the files structure.
 *
 * @param {JSZip} zip ZIP package
 * @param {object} obj Object to add (recursive)
 */
function _addToZip( zip, obj ) {
	if ( _ieExcel === undefined ) {
		// Detect if we are dealing with IE's _awful_ serialiser by seeing if it
		// drop attributes
		_ieExcel = _serialiser
			.serializeToString(
				( new window.DOMParser() ).parseFromString( excelStrings['xl/worksheets/sheet1.xml'], 'text/xml' )
			)
			.indexOf( 'xmlns:r' ) === -1;
	}

	$.each( obj, function ( name, val ) {
		if ( $.isPlainObject( val ) ) {
			var newDir = zip.folder( name );
			_addToZip( newDir, val );
		}
		else {
			if ( _ieExcel ) {
				// IE's XML serialiser will drop some name space attributes from
				// from the root node, so we need to save them. Do this by
				// replacing the namespace nodes with a regular attribute that
				// we convert back when serialised. Edge does not have this
				// issue
				var worksheet = val.childNodes[0];
				var i, ien;
				var attrs = [];

				for ( i=worksheet.attributes.length-1 ; i>=0 ; i-- ) {
					var attrName = worksheet.attributes[i].nodeName;
					var attrValue = worksheet.attributes[i].nodeValue;

					if ( attrName.indexOf( ':' ) !== -1 ) {
						attrs.push( { name: attrName, value: attrValue } );

						worksheet.removeAttribute( attrName );
					}
				}

				for ( i=0, ien=attrs.length ; i<ien ; i++ ) {
					var attr = val.createAttribute( attrs[i].name.replace( ':', '_dt_b_namespace_token_' ) );
					attr.value = attrs[i].value;
					worksheet.setAttributeNode( attr );
				}
			}

			var str = _serialiser.serializeToString(val);

			// Fix IE's XML
			if ( _ieExcel ) {
				// IE doesn't include the XML declaration
				if ( str.indexOf( '<?xml' ) === -1 ) {
					str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;
				}

				// Return namespace attributes to being as such
				str = str.replace( /_dt_b_namespace_token_/g, ':' );

				// Remove testing name space that IE puts into the space preserve attr
				str = str.replace( /xmlns:NS[\d]+="" NS[\d]+:/g, '' );
			}

			// Safari, IE and Edge will put empty name space attributes onto
			// various elements making them useless. This strips them out
			str = str.replace( /<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>' );

			zip.file( name, str );
		}
	} );
}

/**
 * Create an XML node and add any children, attributes, etc without needing to
 * be verbose in the DOM.
 *
 * @param  {object} doc      XML document
 * @param  {string} nodeName Node name
 * @param  {object} opts     Options - can be `attr` (attributes), `children`
 *   (child nodes) and `text` (text content)
 * @return {node}            Created node
 */
function _createNode( doc, nodeName, opts ) {
	var tempNode = doc.createElement( nodeName );

	if ( opts ) {
		if ( opts.attr ) {
			$(tempNode).attr( opts.attr );
		}

		if ( opts.children ) {
			$.each( opts.children, function ( key, value ) {
				tempNode.appendChild( value );
			} );
		}

		if ( opts.text !== null && opts.text !== undefined ) {
			tempNode.appendChild( doc.createTextNode( opts.text ) );
		}
	}

	return tempNode;
}

/**
 * Get the width for an Excel column based on the contents of that column
 * @param  {object} data Data for export
 * @param  {int}    col  Column index
 * @return {int}         Column width
 */
function _excelColWidth( data, col ) {
	var max = data.header[col].length;
	var len, lineSplit, str;

	if ( data.footer && data.footer[col].length > max ) {
		max = data.footer[col].length;
	}

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var point = data.body[i][col];
		str = point !== null && point !== undefined ?
			point.toString() :
			'';

		// If there is a newline character, workout the width of the column
		// based on the longest line in the string
		if ( str.indexOf('\n') !== -1 ) {
			lineSplit = str.split('\n');
			lineSplit.sort( function (a, b) {
				return b.length - a.length;
			} );

			len = lineSplit[0].length;
		}
		else {
			len = str.length;
		}

		if ( len > max ) {
			max = len;
		}

		// Max width rather than having potentially massive column widths
		if ( max > 40 ) {
			return 54; // 40 * 1.35
		}
	}

	max *= 1.35;

	// And a min width
	return max > 6 ? max : 6;
}

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
	"_rels/.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
		'</Relationships>',

	"xl/_rels/workbook.xml.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
		'</Relationships>',

	"[Content_Types].xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
			'<Default Extension="xml" ContentType="application/xml" />'+
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
			'<Default Extension="jpeg" ContentType="image/jpeg" />'+
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
		'</Types>',

	"xl/workbook.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
			'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
			'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
			'<bookViews>'+
				'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
			'</bookViews>'+
			'<sheets>'+
				'<sheet name="Sheet1" sheetId="1" r:id="rId1"/>'+
			'</sheets>'+
			'<definedNames/>'+
		'</workbook>',

	"xl/worksheets/sheet1.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<sheetData/>'+
			'<mergeCells count="0"/>'+
		'</worksheet>',

	"xl/styles.xml":
		'<?xml version="1.0" encoding="UTF-8"?>'+
		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<numFmts count="6">'+
				'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
				'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
				'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
				'<numFmt numFmtId="167" formatCode="0.0%"/>'+
				'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
				'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
			'</numFmts>'+
			'<fonts count="5" x14ac:knownFonts="1">'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<color rgb="FFFFFFFF" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<b />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<i />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<u />'+
				'</font>'+
			'</fonts>'+
			'<fills count="6">'+
				'<fill>'+
					'<patternFill patternType="none" />'+
				'</fill>'+
				'<fill>'+ // Excel appears to use this as a dotted background regardless of values but
					'<patternFill patternType="none" />'+ // to be valid to the schema, use a patternFill
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD9D9D9" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD99795" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6efce" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6cfef" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
			'</fills>'+
			'<borders count="2">'+
				'<border>'+
					'<left />'+
					'<right />'+
					'<top />'+
					'<bottom />'+
					'<diagonal />'+
				'</border>'+
				'<border diagonalUp="false" diagonalDown="false">'+
					'<left style="thin">'+
						'<color auto="1" />'+
					'</left>'+
					'<right style="thin">'+
						'<color auto="1" />'+
					'</right>'+
					'<top style="thin">'+
						'<color auto="1" />'+
					'</top>'+
					'<bottom style="thin">'+
						'<color auto="1" />'+
					'</bottom>'+
					'<diagonal />'+
				'</border>'+
			'</borders>'+
			'<cellStyleXfs count="1">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
			'</cellStyleXfs>'+
			'<cellXfs count="68">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="left"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="center"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="right"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="fill"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment textRotation="90"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment wrapText="1"/>'+
				'</xf>'+
				'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="14" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
			'</cellXfs>'+
			'<cellStyles count="1">'+
				'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
			'</cellStyles>'+
			'<dxfs count="0" />'+
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
		'</styleSheet>'
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
// Ref: section 3.8.30 - built in formatters in open spreadsheet
//   https://www.ecma-international.org/news/TC45_current_work/Office%20Open%20XML%20Part%204%20-%20Markup%20Language%20Reference.pdf
var _excelSpecials = [
	{ match: /^\-?\d+\.\d%$/,               style: 60, fmt: function (d) { return d/100; } }, // Precent with d.p.
	{ match: /^\-?\d+\.?\d*%$/,             style: 56, fmt: function (d) { return d/100; } }, // Percent
	{ match: /^\-?\$[\d,]+.?\d*$/,          style: 57 }, // Dollars
	{ match: /^\-?£[\d,]+.?\d*$/,           style: 58 }, // Pounds
	{ match: /^\-?€[\d,]+.?\d*$/,           style: 59 }, // Euros
	{ match: /^\-?\d+$/,                    style: 65 }, // Numbers without thousand separators
	{ match: /^\-?\d+\.\d{2}$/,             style: 66 }, // Numbers 2 d.p. without thousands separators
	{ match: /^\([\d,]+\)$/,                style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
	{ match: /^\([\d,]+\.\d{2}\)$/,         style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
	{ match: /^\-?[\d,]+$/,                 style: 63 }, // Numbers with thousand separators
	{ match: /^\-?[\d,]+\.\d{2}$/,          style: 64 },
	{ match: /^[\d]{4}\-[\d]{2}\-[\d]{2}$/, style: 67, fmt: function (d) {return Math.round(25569 + (Date.parse(d) / (86400 * 1000)));}} //Date yyyy-mm-dd
];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */

//
// Copy to clipboard
//
DataTable.ext.buttons.copyHtml5 = {
	className: 'buttons-copy buttons-html5',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var exportData = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var newline = _newLine(config);
		var output = exportData.str;
		var hiddenDiv = $('<div/>')
			.css( {
				height: 1,
				width: 1,
				overflow: 'hidden',
				position: 'fixed',
				top: 0,
				left: 0
			} );

		if ( info.title ) {
			output = info.title + newline + newline + output;
		}

		if ( info.messageTop ) {
			output = info.messageTop + newline + newline + output;
		}

		if ( info.messageBottom ) {
			output = output + newline + newline + info.messageBottom;
		}

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		var textarea = $('<textarea readonly/>')
			.val( output )
			.appendTo( hiddenDiv );

		// For browsers that support the copy execCommand, try to use it
		if ( document.queryCommandSupported('copy') ) {
			hiddenDiv.appendTo( dt.table().container() );
			textarea[0].focus();
			textarea[0].select();

			try {
				var successful = document.execCommand( 'copy' );
				hiddenDiv.remove();

				if (successful) {
					dt.buttons.info(
						dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
						dt.i18n( 'buttons.copySuccess', {
							1: 'Copied one row to clipboard',
							_: 'Copied %d rows to clipboard'
						}, exportData.rows ),
						2000
					);

					this.processing( false );
					return;
				}
			}
			catch (t) {}
		}

		// Otherwise we show the text box and instruct the user to use it
		var message = $('<span>'+dt.i18n( 'buttons.copyKeys',
				'Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>'+
				'To cancel, click this message or press escape.' )+'</span>'
			)
			.append( hiddenDiv );

		dt.buttons.info( dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ), message, 0 );

		// Select the text so when the user activates their system clipboard
		// it will copy that text
		textarea[0].focus();
		textarea[0].select();

		// Event to hide the message when the user is done
		var container = $(message).closest('.dt-button-info');
		var close = function () {
			container.off( 'click.buttons-copy' );
			$(document).off( '.buttons-copy' );
			dt.buttons.info( false );
		};

		container.on( 'click.buttons-copy', close );
		$(document)
			.on( 'keydown.buttons-copy', function (e) {
				if ( e.keyCode === 27 ) { // esc
					close();
					that.processing( false );
				}
			} )
			.on( 'copy.buttons-copy cut.buttons-copy', function () {
				close();
				that.processing( false );
			} );
	},

	exportOptions: {},

	fieldSeparator: '\t',

	fieldBoundary: '',

	header: true,

	footer: false,

	title: '*',

	messageTop: '*',

	messageBottom: '*'
};

//
// CSV export
//
DataTable.ext.buttons.csvHtml5 = {
	bom: false,

	className: 'buttons-csv buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.Blob;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		// Set the text
		var output = _exportData( dt, config ).str;
		var info = dt.buttons.exportInfo(config);
		var charset = config.charset;

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		if ( charset !== false ) {
			if ( ! charset ) {
				charset = document.characterSet || document.charset;
			}

			if ( charset ) {
				charset = ';charset='+charset;
			}
		}
		else {
			charset = '';
		}

		if ( config.bom ) {
			output = '\ufeff' + output;
		}

		_saveAs(
			new Blob( [output], {type: 'text/csv'+charset} ),
			info.filename,
			true
		);

		this.processing( false );
	},

	filename: '*',

	extension: '.csv',

	exportOptions: {},

	fieldSeparator: ',',

	fieldBoundary: '"',

	escapeChar: '"',

	charset: null,

	header: true,

	footer: false
};

//
// Excel (xlsx) export
//
DataTable.ext.buttons.excelHtml5 = {
	className: 'buttons-excel buttons-html5',

	available: function () {
		return window.FileReader !== undefined && _jsZip() !== undefined && ! _isDuffSafari() && _serialiser;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var rowPos = 0;
		var dataStartRow, dataEndRow;
		var getXml = function ( type ) {
			var str = excelStrings[ type ];

			//str = str.replace( /xmlns:/g, 'xmlns_' ).replace( /mc:/g, 'mc_' );

			return $.parseXML( str );
		};
		var rels = getXml('xl/worksheets/sheet1.xml');
		var relsGet = rels.getElementsByTagName( "sheetData" )[0];

		var xlsx = {
			_rels: {
				".rels": getXml('_rels/.rels')
			},
			xl: {
				_rels: {
					"workbook.xml.rels": getXml('xl/_rels/workbook.xml.rels')
				},
				"workbook.xml": getXml('xl/workbook.xml'),
				"styles.xml": getXml('xl/styles.xml'),
				"worksheets": {
					"sheet1.xml": rels
				}

			},
			"[Content_Types].xml": getXml('[Content_Types].xml')
		};

		var data = dt.buttons.exportData( config.exportOptions );
		var currentRow, rowNode;
		var addRow = function ( row ) {
			currentRow = rowPos+1;
			rowNode = _createNode( rels, "row", { attr: {r:currentRow} } );

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				// Concat both the Cell Columns as a letter and the Row of the cell.
				var cellId = createCellPos(i) + '' + currentRow;
				var cell = null;

				// For null, undefined of blank cell, continue so it doesn't create the _createNode
				if ( row[i] === null || row[i] === undefined || row[i] === '' ) {
					if ( config.createEmptyCells === true ) {
						row[i] = '';
					}
					else {
						continue;
					}
				}

				var originalContent = row[i];
				row[i] = typeof row[i].trim === 'function'
					? row[i].trim()
					: row[i];

				// Special number formatting options
				for ( var j=0, jen=_excelSpecials.length ; j<jen ; j++ ) {
					var special = _excelSpecials[j];

					// TODO Need to provide the ability for the specials to say
					// if they are returning a string, since at the moment it is
					// assumed to be a number
					if ( row[i].match && ! row[i].match(/^0\d+/) && row[i].match( special.match ) ) {
						var val = row[i].replace(/[^\d\.\-]/g, '');

						if ( special.fmt ) {
							val = special.fmt( val );
						}

						cell = _createNode( rels, 'c', {
							attr: {
								r: cellId,
								s: special.style
							},
							children: [
								_createNode( rels, 'v', { text: val } )
							]



