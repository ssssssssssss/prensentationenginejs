'use strict';

import {bind2} from "./obj_helper.js";

function presentationEngineStop()
{
    alert( 'We are sorry! An unexpected error occurred.\nThe presentation engine will be stopped' );
    document.onkeydown = null;
    document.onkeypress = null;
    document.onclick = null;
    window.onmousewheel = null;
}

export function assert( condition, message )
{
    if (!condition)
    {
        presentationEngineStop();
        if (typeof console == 'object')
            // eslint-disable-next-line no-console
            console.trace();
        throw new Error( message );
    }
}

/*********************
 ** Debug Utilities **
 *********************/
export function log( message )
{
    if( typeof console == 'object' )
    {
        // eslint-disable-next-line no-console
        console.log( message );
    }
    else if( typeof opera == 'object' )
    {
        opera.postError( message );
    }
    // eslint-disable-next-line no-undef
    else if( typeof java == 'object' && typeof java.lang == 'object' )
    {
        // eslint-disable-next-line no-undef
        java.lang.System.out.println( message );
    }
}

function DebugPrinter()
{
    this.bEnabled = false;
}


DebugPrinter.prototype.on = function()
{
    this.bEnabled = true;
};

DebugPrinter.prototype.off = function()
{
    this.bEnabled = false;
};

DebugPrinter.prototype.isEnabled = function()
{
    return this.bEnabled;
};

DebugPrinter.prototype.print = function( sMessage, nTime )
{
    if( this.isEnabled() )
    {
        var sInfo = 'DBG: ' + sMessage;
        if( nTime )
            sInfo += ' (at: ' + String( nTime / 1000 ) + 's)';
        log( sInfo );
    }
};


// - Debug Printers -
var aGenericDebugPrinter = new DebugPrinter();
aGenericDebugPrinter.on();
export const DBGLOG = bind2( DebugPrinter.prototype.print, aGenericDebugPrinter );

export const ANIMDBG = new DebugPrinter();
ANIMDBG.off();

export const aRegisterEventDebugPrinter = new DebugPrinter();
aRegisterEventDebugPrinter.off();

export const aTimerEventQueueDebugPrinter = new DebugPrinter();
aTimerEventQueueDebugPrinter.off();

export const aEventMultiplexerDebugPrinter = new DebugPrinter();
aEventMultiplexerDebugPrinter.off();

export const aNextEffectEventArrayDebugPrinter = new DebugPrinter();
aNextEffectEventArrayDebugPrinter.off();

export const aActivityQueueDebugPrinter = new DebugPrinter();
aActivityQueueDebugPrinter.off();

export const aAnimatedElementDebugPrinter = new DebugPrinter();
aAnimatedElementDebugPrinter.off();
