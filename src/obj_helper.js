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

/***************************
 ** OOP support functions **
 ***************************/

export function object( aObject )
{
    var F = function() {};
    F.prototype = aObject;
    return new F();
}


export function extend( aSubType, aSuperType )
{
    if (!aSuperType || !aSubType)
    {
        alert('extend failed, verify dependencies');
    }
    var OP = Object.prototype;
    var sp = aSuperType.prototype;
    var rp = object( sp );
    aSubType.prototype = rp;

    rp.constructor = aSubType;
    aSubType.superclass = sp;

    // assign constructor property
    if (aSuperType != Object && sp.constructor == OP.constructor)
    {
        sp.constructor = aSuperType;
    }

    return aSubType;
}


export function instantiate( TemplateClass, BaseType )
{
    if( !TemplateClass.instanceSet )
        TemplateClass.instanceSet = [];

    var nSize = TemplateClass.instanceSet.length;

    for( var i = 0; i < nSize; ++i )
    {
        if( TemplateClass.instanceSet[i].base === BaseType )
            return TemplateClass.instanceSet[i].instance;
    }

    TemplateClass.instanceSet[ nSize ] = {};
    TemplateClass.instanceSet[ nSize ].base = BaseType;
    TemplateClass.instanceSet[ nSize ].instance = TemplateClass( BaseType );

    return TemplateClass.instanceSet[ nSize ].instance;
}
