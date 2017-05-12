'use strict';

export function mem_fn( sMethodName )
{
    return  function( aObject )
    {
        var aMethod = aObject[ sMethodName ];
        if( aMethod )
            aMethod.call( aObject );
        else
            log( 'method sMethodName not found' );
    };
}

export function bind( aObject, aMethod )
{
    return  function()
    {
        return aMethod.call( aObject, arguments[0] );
    };
}

export function bind2( aFunction )
{
    if( !aFunction  )
        log( 'bind2: passed function is not valid.' );

    var aBoundArgList = arguments;

    var aResultFunction = null;

    switch( aBoundArgList.length )
    {
        case 1: aResultFunction = function()
                {
                    return aFunction.call( arguments[0], arguments[1],
                                           arguments[2], arguments[3],
                                           arguments[4] );
                };
                break;
        case 2: aResultFunction = function()
                {
                    return aFunction.call( aBoundArgList[1], arguments[0],
                                           arguments[1], arguments[2],
                                           arguments[3] );
                };
                break;
        case 3: aResultFunction = function()
                {
                    return aFunction.call( aBoundArgList[1], aBoundArgList[2],
                                           arguments[0], arguments[1],
                                           arguments[2] );
                };
                break;
        case 4: aResultFunction = function()
                {
                    return aFunction.call( aBoundArgList[1], aBoundArgList[2],
                                           aBoundArgList[3], arguments[0],
                                           arguments[1] );
                };
                break;
        case 5: aResultFunction = function()
                {
                    return aFunction.call( aBoundArgList[1], aBoundArgList[2],
                                           aBoundArgList[3], aBoundArgList[4],
                                           arguments[0] );
                };
                break;
        default:
            log( 'bind2: arity not handled.' );
    }

    return aResultFunction;
}
