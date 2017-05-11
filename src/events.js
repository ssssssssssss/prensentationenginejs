/*****
 * @licstart
 *
 * The following is the license notice for the part of JavaScript code of this
 * page included between the '@jessyinkstart' and the '@jessyinkend' notes.
 */

/*****  ******************************************************************
 *
 * Copyright 2008-2013 Hannes Hochreiner
 *
 * The JavaScript code included between the start note '@jessyinkstart'
 * and the end note '@jessyinkend' is subject to the terms of the Mozilla
 * Public License, v. 2.0. If a copy of the MPL was not distributed with
 * this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Alternatively, you can redistribute and/or that part of this file
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
*/

/*****
 *  You can find the complete source code of the JessyInk project at:
 *  @source http://code.google.com/p/jessyink/
 */

/*****
 * @licend
 *
 * The above is the license notice for the part of JavaScript code of this
 * page included between the '@jessyinkstart' and the '@jessyinkend' notes.
 */



/*****
 * @jessyinkstart
 *
 *  The following code is a derivative work of some parts of the JessyInk
 *  project.
 *  @source http://code.google.com/p/jessyink/
 */

/** Convenience function to get an element depending on whether it has a
 *  property with a particular name.
 *
 *  @param node   element of the document
 *  @param name   attribute name
 *
 *  @returns   Array array containing all the elements of the tree with root
 *             'node' that own the property 'name'
 */
function getElementsByProperty( node, name )
{
    var elements = [];

    if( node.getAttribute( name ) )
        elements.push( node );

    for( var counter = 0; counter < node.childNodes.length; ++counter )
    {
        if( node.childNodes[counter].nodeType == 1 )
        {
            var subElements = getElementsByProperty( node.childNodes[counter], name );
            elements = elements.concat( subElements );
        }
    }
    return elements;
}

/** Event handler for key press.
 *
 *  @param aEvt the event
 */
function onKeyDown( aEvt )
{
    if ( !aEvt )
        aEvt = window.event;

    var code = aEvt.keyCode || aEvt.charCode;

    if( !processingEffect && keyCodeDictionary[currentMode] && keyCodeDictionary[currentMode][code] )
    {
        return keyCodeDictionary[currentMode][code]();
    }
    else
    {
        document.onkeypress = onKeyPress;
        return null;
    }
}
//Set event handler for key down.
document.onkeydown = onKeyDown;

/** Event handler for key press.
 *
 *  @param aEvt the event
 */
function onKeyPress( aEvt )
{
    document.onkeypress = null;

    if ( !aEvt )
        aEvt = window.event;

    var str = String.fromCharCode( aEvt.keyCode || aEvt.charCode );

    if ( !processingEffect && charCodeDictionary[currentMode] && charCodeDictionary[currentMode][str] )
        return charCodeDictionary[currentMode][str]();

    return null;
}

/** Function to supply the default key code dictionary.
 *
 *  @returns Object default key code dictionary
 */
function getDefaultKeyCodeDictionary()
{
    var keyCodeDict = {};

    keyCodeDict[SLIDE_MODE] = {};
    keyCodeDict[INDEX_MODE] = {};

    // slide mode
    keyCodeDict[SLIDE_MODE][LEFT_KEY]
        = function() { return aSlideShow.rewindEffect(); };
    keyCodeDict[SLIDE_MODE][RIGHT_KEY]
        = function() { return dispatchEffects(1); };
    keyCodeDict[SLIDE_MODE][UP_KEY]
        = function() { return aSlideShow.rewindEffect(); };
    keyCodeDict[SLIDE_MODE][DOWN_KEY]
        = function() { return skipEffects(1); };
    keyCodeDict[SLIDE_MODE][PAGE_UP_KEY]
        = function() { return aSlideShow.rewindAllEffects(); };
    keyCodeDict[SLIDE_MODE][PAGE_DOWN_KEY]
        = function() { return skipAllEffects(); };
    keyCodeDict[SLIDE_MODE][HOME_KEY]
        = function() { return aSlideShow.displaySlide( 0, true ); };
    keyCodeDict[SLIDE_MODE][END_KEY]
        = function() { return aSlideShow.displaySlide( theMetaDoc.nNumberOfSlides - 1, true ); };
    keyCodeDict[SLIDE_MODE][SPACE_KEY]
        = function() { return dispatchEffects(1); };

    // index mode
    keyCodeDict[INDEX_MODE][LEFT_KEY]
        = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex - 1 ); };
    keyCodeDict[INDEX_MODE][RIGHT_KEY]
        = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex + 1 ); };
    keyCodeDict[INDEX_MODE][UP_KEY]
        = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex - theSlideIndexPage.indexColumns ); };
    keyCodeDict[INDEX_MODE][DOWN_KEY]
        = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex + theSlideIndexPage.indexColumns ); };
    keyCodeDict[INDEX_MODE][PAGE_UP_KEY]
        = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex - theSlideIndexPage.getTotalThumbnails() ); };
    keyCodeDict[INDEX_MODE][PAGE_DOWN_KEY]
        = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex + theSlideIndexPage.getTotalThumbnails() ); };
    keyCodeDict[INDEX_MODE][HOME_KEY]
        = function() { return indexSetPageSlide( 0 ); };
    keyCodeDict[INDEX_MODE][END_KEY]
        = function() { return indexSetPageSlide( theMetaDoc.nNumberOfSlides - 1 ); };
    keyCodeDict[INDEX_MODE][ENTER_KEY]
        = function() { return toggleSlideIndex(); };
    keyCodeDict[INDEX_MODE][SPACE_KEY]
        = function() { return toggleSlideIndex(); };
    keyCodeDict[INDEX_MODE][ESCAPE_KEY]
        = function() { return abandonIndexMode(); };

    return keyCodeDict;
}

/** Function to supply the default char code dictionary.
 *
 *  @returns Object char code dictionary
 */
function getDefaultCharCodeDictionary()
{
    var charCodeDict = {};

    charCodeDict[SLIDE_MODE] = {};
    charCodeDict[INDEX_MODE] = {};

    // slide mode
    charCodeDict[SLIDE_MODE]['i']
        = function () { return toggleSlideIndex(); };

    // index mode
    charCodeDict[INDEX_MODE]['i']
        = function () { return toggleSlideIndex(); };
    charCodeDict[INDEX_MODE]['-']
        = function () { return theSlideIndexPage.decreaseNumberOfColumns(); };
    charCodeDict[INDEX_MODE]['=']
        = function () { return theSlideIndexPage.increaseNumberOfColumns(); };
    charCodeDict[INDEX_MODE]['+']
        = function () { return theSlideIndexPage.increaseNumberOfColumns(); };
    charCodeDict[INDEX_MODE]['0']
        = function () { return theSlideIndexPage.resetNumberOfColumns(); };

    return charCodeDict;
}


function slideOnMouseUp( aEvt )
{
    if (!aEvt)
        aEvt = window.event;

    var nOffset = 0;

    if( aEvt.button == 0 )
        nOffset = 1;
    else if( aEvt.button == 2 )
        nOffset = -1;

    if( 0 != nOffset )
        dispatchEffects( nOffset );
    return true; // the click has been handled
}

document.handleClick = slideOnMouseUp;


/** Event handler for mouse wheel events in slide mode.
 *  based on http://adomas.org/javascript-mouse-wheel/
 *
 *  @param aEvt the event
 */
function slideOnMouseWheel(aEvt)
{
    var delta = 0;

    if (!aEvt)
        aEvt = window.event;

    if (aEvt.wheelDelta)
    { // IE Opera
        delta = aEvt.wheelDelta/120;
    }
    else if (aEvt.detail)
    { // MOZ
        delta = -aEvt.detail/3;
    }

    if (delta > 0)
        skipEffects(-1);
    else if (delta < 0)
        skipEffects(1);

    if (aEvt.preventDefault)
        aEvt.preventDefault();

    aEvt.returnValue = false;
}

//Mozilla
if( window.addEventListener )
{
    window.addEventListener( 'DOMMouseScroll', function( aEvt ) { return mouseHandlerDispatch( aEvt, MOUSE_WHEEL ); }, false );
}

//Opera Safari OK - may not work in IE
window.onmousewheel
    = function( aEvt ) { return mouseHandlerDispatch( aEvt, MOUSE_WHEEL ); };

/** Function to handle all mouse events.
 *
 *  @param  aEvt    event
 *  @param  anAction  type of event (e.g. mouse up, mouse wheel)
 */
function mouseHandlerDispatch( aEvt, anAction )
{
    if( !aEvt )
        aEvt = window.event;

    var retVal = true;

    if ( mouseHandlerDictionary[currentMode] && mouseHandlerDictionary[currentMode][anAction] )
    {
        var subRetVal = mouseHandlerDictionary[currentMode][anAction]( aEvt );

        if( subRetVal != null && subRetVal != undefined )
            retVal = subRetVal;
    }

    if( aEvt.preventDefault && !retVal )
        aEvt.preventDefault();

    aEvt.returnValue = retVal;

    return retVal;
}

//Set mouse event handler.
document.onmouseup = function( aEvt ) { return mouseHandlerDispatch( aEvt, MOUSE_UP ); };


/** mouseClickHelper
 *
 * @return {Object}
 *   a mouse click handler
 */
function mouseClickHelper( aEvt )
{
    // In case text is selected we stay on the current slide.
    // Anyway if we are dealing with Firefox there is an issue:
    // Firefox supports a naive way of selecting svg text, if you click
    // on text the current selection is set to the whole text fragment
    // wrapped by the related <tspan> element.
    // That means until you click on text you never move to the next slide.
    // In order to avoid this case we do not test the status of current
    // selection, when the presentation is running on a mozilla browser.
    if( !Detect.isMozilla )
    {
        var aWindowObject = document.defaultView;
        if( aWindowObject )
        {
            var aTextSelection = aWindowObject.getSelection();
            var sSelectedText =  aTextSelection.toString();
            if( sSelectedText )
            {
                DBGLOG( 'text selection: ' + sSelectedText );
                if( sLastSelectedText !== sSelectedText )
                {
                    bTextHasBeenSelected = true;
                    sLastSelectedText = sSelectedText;
                }
                else
                {
                    bTextHasBeenSelected = false;
                }
                return null;
            }
            else if( bTextHasBeenSelected )
            {
                bTextHasBeenSelected = false;
                sLastSelectedText = '';
                return null;
            }
        }
        else
        {
            log( 'error: HyperlinkElement.handleClick: invalid window object.' );
        }
    }

    var aSlideAnimationsHandler = theMetaDoc.aMetaSlideSet[nCurSlide].aSlideAnimationsHandler;
    if( aSlideAnimationsHandler )
    {
        var aCurrentEventMultiplexer = aSlideAnimationsHandler.aEventMultiplexer;
        if( aCurrentEventMultiplexer )
        {
            if( aCurrentEventMultiplexer.hasRegisteredMouseClickHandlers() )
            {
                return aCurrentEventMultiplexer.notifyMouseClick( aEvt );
            }
        }
    }
    return slideOnMouseUp( aEvt );
}


/** Function to supply the default mouse handler dictionary.
 *
 *  @returns Object default mouse handler dictionary
 */
function getDefaultMouseHandlerDictionary()
{
    var mouseHandlerDict = {};

    mouseHandlerDict[SLIDE_MODE] = {};
    mouseHandlerDict[INDEX_MODE] = {};

    // slide mode
    mouseHandlerDict[SLIDE_MODE][MOUSE_UP]
        = mouseClickHelper;

    mouseHandlerDict[SLIDE_MODE][MOUSE_WHEEL]
        = function( aEvt ) { return slideOnMouseWheel( aEvt ); };

    // index mode
    mouseHandlerDict[INDEX_MODE][MOUSE_UP]
        = function( ) { return toggleSlideIndex(); };

    return mouseHandlerDict;
}

/** Function to set the page and active slide in index view.
 *
 *  @param nIndex index of the active slide
 *
 *  NOTE: To force a redraw,
 *  set INDEX_OFFSET to -1 before calling indexSetPageSlide().
 *
 *  This is necessary for zooming (otherwise the index might not
 *  get redrawn) and when switching to index mode.
 *
 *  INDEX_OFFSET = -1
 *  indexSetPageSlide(activeSlide);
 */
function indexSetPageSlide( nIndex )
{
    var aMetaSlideSet = theMetaDoc.aMetaSlideSet;
    nIndex = getSafeIndex( nIndex, 0, aMetaSlideSet.length - 1 );

    //calculate the offset
    var nSelectedThumbnailIndex = nIndex % theSlideIndexPage.getTotalThumbnails();
    var offset = nIndex - nSelectedThumbnailIndex;

    if( offset < 0 )
        offset = 0;

    //if different from kept offset, then record and change the page
    if( offset != INDEX_OFFSET )
    {
        INDEX_OFFSET = offset;
        displayIndex( INDEX_OFFSET );
    }

    //set the selected thumbnail and the current slide
    theSlideIndexPage.setSelection( nSelectedThumbnailIndex );
}


/*****
 * @jessyinkend
 *
 *  The above code is a derivative work of some parts of the JessyInk project.
 *  @source http://code.google.com/p/jessyink/
 */
