import NSS from "./namespace.js";

function createUnitSquarePath()
{
    var aPath = document.createElementNS( NSS['svg'], 'path' );
    var sD = 'M 0 0 L 1 0 L 1 1 L 0 1 L 0 0';
    aPath.setAttribute( 'd', sD );
    return aPath;
}

function createEmptyPath()
{
    var aPath = document.createElementNS( NSS['svg'], 'path' );
    var sD = 'M 0 0 L 0 0';
    aPath.setAttribute( 'd', sD );
    return aPath;
}

function pruneScaleValue( nVal )
{
    if( nVal < 0.0 )
        return (nVal < -0.00001 ? nVal : -0.00001);
    else
        return (nVal > 0.00001 ? nVal : 0.00001);
}


/** Class BarWipePath
 *  This class handles a <path> element that defines a unit square and
 *  transforms it accordingly to a parameter in the [0,1] range for performing
 *  a left to right barWipe transition.
 *
 *  @param nBars
 *     The number of bars to be generated.
 */
export function BarWipePath( nBars /* nBars > 1: blinds effect */ )
{
    this.nBars = nBars;
    if( this.nBars === undefined || this.nBars < 1 )
        this.nBars = 1;
    this.aBasePath = createUnitSquarePath();
}

/** perform
 *
 *  @param nT
 *      A parameter in [0,1] representing the width of the generated bars.
 *  @return SVGPathElement
 *      A svg <path> element representing a multi-bars.
 */
BarWipePath.prototype.perform = function( nT )
{

    var aMatrix = SVGIdentityMatrix.scaleNonUniform( pruneScaleValue( nT / this.nBars ), 1.0 );

    var aPolyPath = this.aBasePath.cloneNode( true );
    aPolyPath.matrixTransform( aMatrix );

    if( this.nBars > 1 )
    {
        var i;
        var aTransform;
        var aPath;
        for( i = this.nBars - 1; i > 0; --i )
        {
            aTransform = SVGIdentityMatrix.translate( i / this.nBars, 0.0 );
            aTransform = aTransform.multiply( aMatrix );
            aPath = this.aBasePath.cloneNode( true );
            aPath.matrixTransform( aTransform );
            aPolyPath.appendPath( aPath );
        }
    }
    return aPolyPath;
};


/** Class BoxWipePath
 *  This class handles a path made up by one square and is utilized for
 *  performing BoxWipe transitions.
 *
 *  @param bIsTopCentered
 *      if true the transition subtype is top centered else not.
 */
export function BoxWipePath(bIsTopCentered) {
    this.bIsTopCentered = bIsTopCentered;
    this.aBasePath = createUnitSquarePath();
}

BoxWipePath.prototype.perform = function( nT ) {
    var d = pruneScaleValue(nT);
    var aTransform = SVGIdentityMatrix;
    if(this.bIsTopCentered) {
        aTransform = aTransform.translate(-0.5, 0.0).scale(d, d).translate(0.5, 0.0);
    }
    else {
        aTransform = aTransform.scale(d, d);
    }
    var aPath = this.aBasePath.cloneNode(true);
    aPath.matrixTransform(aTransform);
    return aPath;
}

/* Class SweepWipePath
 *
 *
 */
export function SweepWipePath(bCenter, bSingle, bOppositeVertical, bFlipOnYAxis) {
  this.bCenter = bCenter;
  this.bSingle = bSingle;
  this.bOppositeVertical = bOppositeVertical;
  this.bFlipOnYAxis = bFlipOnYAxis;
  this.aBasePath = createUnitSquarePath();
}

SweepWipePath.prototype.perform = function( nT ) {
    nT /= 2.0;
    if(!this.bCenter)
        nT /= 2.0;
    if(!this.bSingle && !this.bOppositeVertical)
        nT /= 2.0;

    var poly = PinWheelWipePath.calcCenteredClock( nT + 0.25, 1.0 );
    var aTransform;

    if(this.bCenter) {
        aTransform = SVGIdentityMatrix.translate(0.5, 0.0);
        poly.matrixTransform(aTransform);
    }
    var res = poly;

    if(!this.bSingle) {
        if(this.bOppositeVertical) {
            aTransform = SVGIdentityMatrix.scale(1.0, -1.0);
            aTransform.translate(0.0, 1.0);
            poly.matrixTransform(aTransform);
            poly.changeOrientation();
        }
        else {
            aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
            aTransform.rotate(Math.PI);
            aTransform.translate(0.5, 0.5);
            poly.matrixTransform(aTransform);
        }
        res.appendPath(poly);
    }
    return this.bFlipOnYAxis ? flipOnYAxis(res) : res;
}

/** Class FourBoxWipePath
 *  This class handles a path made up by four squares and is utilized for
 *  performing fourBoxWipe transitions.
 *
 *  @param bCornersOut
 *      If true the transition subtype is cornersOut else is cornersIn.
 */
export function FourBoxWipePath( bCornersOut )
{
    this.bCornersOut = bCornersOut;
    this.aBasePath = createUnitSquarePath();
}

FourBoxWipePath.prototype.perform = function( nT )
{
    var aMatrix;
    var d = pruneScaleValue( nT / 2.0 );

    if( this.bCornersOut )
    {
        aMatrix = SVGIdentityMatrix.translate( -0.25, -0.25 ).scale( d ).translate( -0.5, -0.5 );
    }
    else
    {
        aMatrix = SVGIdentityMatrix.translate( -0.5, -0.5 ).scale( d );
    }


    var aTransform = aMatrix;
    // top left
    var aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    var aPolyPath = aSquare;
    // bottom left, flip on x-axis:
    aMatrix = SVGIdentityMatrix.flipY();
    aTransform = aMatrix.multiply( aTransform );
    aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    aSquare.changeOrientation();
    aPolyPath.appendPath( aSquare );
    // bottom right, flip on y-axis:
    aMatrix = SVGIdentityMatrix.flipX();
    aTransform = aMatrix.multiply( aTransform );
    aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    aPolyPath.appendPath( aSquare );
    // top right, flip on x-axis:
    aMatrix = SVGIdentityMatrix.flipY();
    aTransform = aMatrix.multiply( aTransform );
    aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    aSquare.changeOrientation();
    aPolyPath.appendPath( aSquare );

    // Remind: operations are applied in inverse order
    aMatrix = SVGIdentityMatrix.translate( 0.5, 0.5 );
    // We enlarge a bit the clip path so we avoid that in reverse direction
    // some thin line of the border stroke is visible.
    aMatrix = aMatrix.scale( 1.1 );
    aPolyPath.matrixTransform( aMatrix );

    return aPolyPath;
};




/** Class EllipseWipePath
 *  This class handles a parametric ellipse represented by a path made up of
 *  cubic Bezier curve segments that helps in performing the ellipseWipe
 *  transition.
 *
 *  @param eSubtype
 *      The transition subtype.
 */
export function EllipseWipePath( eSubtype )
{
    this.eSubtype = eSubtype;

    // precomputed circle( 0.5, 0.5, SQRT2 / 2 )
    var sPathData = 'M 0.5 -0.207107 ' +
                    'C 0.687536 -0.207107 0.867392 -0.132608 1 0 ' +
                    'C 1.13261 0.132608 1.20711 0.312464 1.20711 0.5 ' +
                    'C 1.20711 0.687536 1.13261 0.867392 1 1 ' +
                    'C 0.867392 1.13261 0.687536 1.20711 0.5 1.20711 ' +
                    'C 0.312464 1.20711 0.132608 1.13261 0 1 ' +
                    'C -0.132608 0.867392 -0.207107 0.687536 -0.207107 0.5 ' +
                    'C -0.207107 0.312464 -0.132608 0.132608 0 0 ' +
                    'C 0.132608 -0.132608 0.312464 -0.207107 0.5 -0.207107';

    this.aBasePath = document.createElementNS( NSS['svg'], 'path' );
    this.aBasePath.setAttribute( 'd', sPathData );
}

EllipseWipePath.prototype.perform = function( nT )
{

    var aTransform = SVGIdentityMatrix.translate( 0.5, 0.5 ).scale( nT ).translate( -0.5, -0.5 );
    var aEllipse = this.aBasePath.cloneNode( true );
    aEllipse.matrixTransform( aTransform );

    return aEllipse;
};

/*
 * Class FanWipePath
 *
 */
export function FanWipePath(bIsCenter, bIsSingle, bIsFanIn) {
    this.bCenter = bIsCenter;
    this.bSingle = bIsSingle;
    this.bFanIn  = bIsFanIn;
    this.aBasePath = createUnitSquarePath();
}

FanWipePath.prototype.perform = function( nT ) {
  var res = this.aBasePath.cloneNode(true);
  var poly = PinWheelWipePath.calcCenteredClock(
          nT / ((this.bCenter && this.bSingle) ? 2.0 : 4.0), 1.0);
  res.appendPath(poly);
  // flip on y-axis
  var aTransform = SVGIdentityMatrix.flipY();
  aTransform = aTransform.scaleNonUniform(-1.0, 1.0);
  poly.matrixTransform(aTransform);
  res.appendPath(poly);

  if(this.bCenter) {
      aTransform = SVGIdentityMatrix.scaleNonUniform(0.5, 0.5).translate(0.5, 0.5);
      res.matrixTransform(aTransform);

      if(!this.bSingle)
          res.appendPath(flipOnXAxis(res));
  }
  else {
      aTransform = SVGIdentityMatrix.scaleNonUniform(0.5, 1.0).translate(0.5, 1.0);
      res.matrixTransform(aTransform);
  }
  return res;
}

/**
 * Class ClockWipePath
 *
 */
export function ClockWipePath() { }

ClockWipePath.prototype.perform = function( nT ) {
    const aTransform = SVGIdentityMatrix.scaleNonUniform(0.5, 0.5).translate(0.5, 0.5);
    var aPolyPath = PinWheelWipePath.calcCenteredClock(nT, 1.0);
    aPolyPath.matrixTransform( aTransform );

    return aPolyPath;
}

/** Class PinWheelWipePath
 *  This class handles a parametric poly-path that is used for performing
 *  a spinWheelWipe transition.
 *
 *  @param nBlades
 *      Number of blades generated by the transition.
 */
export function PinWheelWipePath( nBlades )
{
    this.nBlades = nBlades;
    if( !this.nBlades || this.nBlades < 1 )
        this.nBlades = 1;
}

PinWheelWipePath.calcCenteredClock = function( nT, nE )
{
    var nMAX_EDGE = 2;

    var aTransform = SVGIdentityMatrix.rotate( nT * 360 );

    var aPoint = document.documentElement.createSVGPoint();
    aPoint.y = -nMAX_EDGE;
    aPoint = aPoint.matrixTransform( aTransform );

    var sPathData = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
    if( nT >= 0.875 )
        // L -e -e
        sPathData += 'L ' + '-' + nE + ' -' + nE + ' ';
    if( nT >= 0.625 )
        // L -e e
        sPathData += 'L ' + '-' + nE + ' ' + nE + ' ';
    if( nT >= 0.375 )
        // L e e
        sPathData += 'L ' + nE + ' ' + nE + ' ';
     if( nT >= 0.125 )
        // L e -e
        sPathData += 'L ' + nE + ' -' + nE + ' ';

    // L 0 -e
    sPathData += 'L 0 -' + nE + ' ';
    sPathData += 'L 0 0 ';
    // Z
    sPathData += 'L '  + aPoint.x + ' ' + aPoint.y;

    var aPath = document.createElementNS( NSS['svg'], 'path' );
    aPath.setAttribute( 'd', sPathData );
    return aPath;
};

PinWheelWipePath.prototype.perform = function( nT )
{
    var aBasePath = PinWheelWipePath.calcCenteredClock( nT / this.nBlades,
                                                        2.0 /* max edge when rotating */  );

    var aPolyPath = aBasePath.cloneNode( true );
    var aPath;
    var aRotation;
    var i;
    for( i = this.nBlades - 1; i > 0; --i )
    {
        aRotation = SVGIdentityMatrix.rotate( (i * 360) / this.nBlades );
        aPath = aBasePath.cloneNode( true );
        aPath.matrixTransform( aRotation );
        aPolyPath.appendPath( aPath );
    }

    var aTransform = SVGIdentityMatrix.translate( 0.5, 0.5 ).scale( 0.5 );
    aPolyPath.matrixTransform( aTransform );

    return aPolyPath;
};

/** Class BarnDoorWipe
  *
  * @param doubled
  */
export function BarnDoorWipePath(doubled) {
    this.aBasePath = createUnitSquarePath();
    this.doubled   = doubled;
}

BarnDoorWipePath.prototype.perform = function( nT ) {
    if(this.doubled)
        nT /= 2.0;
    var aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform = aTransform.scaleNonUniform(pruneScaleValue(nT), 1.0).translate(0.5, 0.5);
    var aPath = this.aBasePath.cloneNode(true);
    aPath.matrixTransform(aTransform);
    var res = aPath;

    if(this.doubled) {
        aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
        aTransform = aTransform.rotate(Math.PI / 2).translate(0.5, 0.5);
        aPath.matrixTransform(aTransform);
        res.appendPath(aPath);
    }
    return res;
}

/** Class WaterfallWipe
  *
  * @param nElements
  *     Number of cells to be used
  * @param bFlipOnYAxis
  *     Whether to flip on y-axis or not.
  */
export function WaterfallWipePath(nElements, bFlipOnYAxis) {
    this.bFlipOnYAxis = bFlipOnYAxis;

    var sqrtElements = Math.floor(Math.sqrt(nElements));
    var elementEdge = 1.0/sqrtElements;

    var aPath = 'M '+ 0.0 + ' ' + -1.0 + ' ';
    for(var pos = sqrtElements; pos--; ) {
        var xPos = sqrtElements - pos - 1;
        var yPos = pruneScaleValue( ((pos+1) * elementEdge) - 1.0);

        aPath += 'L ' + pruneScaleValue(xPos * elementEdge) + ' ' + yPos + ' ';
        aPath += 'L ' + pruneScaleValue((xPos+1)*elementEdge) + ' ' + yPos + ' ';
    }
    aPath += 'L ' + 1.0 + ' ' + -1.0 + ' ';
    aPath += 'L ' + 0.0 + ' ' + -1.0 + ' ';
    this.aBasePath = document.createElementNS( NSS['svg'], 'path');
    this.aBasePath.setAttribute('d', aPath);
}

WaterfallWipePath.prototype.perform = function( nT ) {
    var poly = this.aBasePath.cloneNode(true);
    var aTransform = SVGIdentityMatrix.translate(0.0, pruneScaleValue(2.0 * nT));
    poly.matrixTransform(aTransform);
    var aHead = 'M ' + 0.0 + ' ' + -1.0 + ' ';
    var aHeadPath= document.createElementNS( NSS['svg'], 'path');
    aHeadPath.setAttribute('d', aHead);

    var aTail = 'M ' + 1.0 + ' ' + -1.0 + ' ';
    var aTailPath = document.createElementNS( NSS['svg'], 'path');
    aTailPath.setAttribute('d', aTail);

    poly.prependPath(aHeadPath);
    poly.appendPath(aTailPath);

    return this.bFlipOnYAxis ? flipOnYAxis(poly) : poly;
}

/** Class DoubleDiamondWipePath
 *
 */
export function DoubleDiamondWipePath() { }

DoubleDiamondWipePath.prototype.perform = function( nT ) {
    var a = pruneScaleValue(0.25 + (nT * 0.75));
    var aPath = 'M ' + (0.5 + a) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 - a) + ' ';
    aPath += 'L ' + (0.5 - a) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 + a) + ' ';
    aPath += 'L ' + (0.5 + a) + ' ' + 0.5 + ' ';
    var poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    var res = poly.cloneNode(true);

    var b = pruneScaleValue( (1.0 - nT) * 0.25);
    aPath = 'M ' + (0.5 + b) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 + b) + ' ';
    aPath += 'L ' + (0.5 - b) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 - b) + ' ';
    aPath += 'L ' + (0.5 + b) + ' ' + 0.5 + ' ';
    poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    res.appendPath(poly);

    return res;
}

/** Class Iriswipe
  *
  * @param unitRect
  *
  */
export function IrisWipePath(unitRect) {
    this.unitRect = unitRect;
    this.aBasePath = createUnitSquarePath();
}


/** perform
  *
  *  @param nT
  *      A parameter in [0,1] representing the diamond or rectangle.
  *  @return SVGPathElement
  *      A svg <path> element representing a transition.
  */
IrisWipePath.prototype.perform = function( nT ) {
    var d = pruneScaleValue(nT);
    var aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform = aTransform.multiply(SVGIdentityMatrix.scaleNonUniform(d, d).translate(0.5, 0.5));
    var aPath = this.aBasePath.cloneNode(true);
    aPath.matrixTransform(aTransform);
    return aPath;
}

/**
 * Class ZigZagWipePath
 *
 * @param nZigs
 *
 */
export function ZigZagWipePath(nZigs) {
    this.zigEdge = 1.0/nZigs;
    const d = this.zigEdge;
    const d2 = (d / 2.0);
    this.aBasePath = 'M ' + (-1.0 - d) + ' ' + -d + ' ';
    this.aBasePath += 'L ' + (-1.0 - d) + ' ' + (1.0 + d) + ' ';
    this.aBasePath += 'L ' + -d + ' ' + (1.0 + d) + ' ';

    for(var pos = (nZigs + 2); pos--; ) {
        this.aBasePath += 'L ' + 0.0 + ' ' + ((pos - 1) * d + d2) + ' ';
        this.aBasePath += 'L ' + -d + ' ' + (pos - 1) * d + ' ';
    }
    this.aBasePath += 'L ' + (-1.0 - d) + ' ' + -d + ' ';
}

ZigZagWipePath.prototype.perform = function( nT ) {
    var res = document.createElementNS( NSS['svg'], 'path');
    res.setAttribute('d', this.aBasePath);
    res.matrixTransform(SVGIdentityMatrix.translate((1.0 + this.zigEdge) * nT, 0.0));
    return res;
}

/*
 * Class BarnZigZagWipePath
 *
 * @param nZigs
 *
 */
export function BarnZigZagWipePath( nZigs ) { ZigZagWipePath.call(this, nZigs); }

BarnZigZagWipePath.prototype = Object.create(ZigZagWipePath);

BarnZigZagWipePath.prototype.perform = function( nT ) {
    var res = createEmptyPath();
    var poly = document.createElementNS( NSS['svg'], 'path');
    var aTransform = SVGIdentityMatrix.translate(
        ((1.0 + this.zigEdge) * (1.0 - nT)) / 2.0, 0.0);
    poly.setAttribute('d', this.aBasePath);
    poly.changeOrientation();
    poly.matrixTransform(aTransform);
    res.appendPath(poly);

    aTransform = SVGIdentityMatrix.scale(-1.0, 1.0);
    aTransform.translate(1.0, this.zigEdge / 2.0);
    poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', this.aBasePath);
    poly.matrixTransform(aTransform);
    res.appendPath(poly);

    return res;
}

/** Class CheckerBoardWipePath
 *
 *  @param unitsPerEdge
 *     The number of cells (per line and column) in the checker board.
 */
export function CheckerBoardWipePath( unitsPerEdge )
{
    this.unitsPerEdge = unitsPerEdge;
    if( this.unitsPerEdge === undefined || this.unitsPerEdge < 1 )
        this.unitsPerEdge = 10;
    this.aBasePath = createUnitSquarePath();
}

/** perform
 *
 *  @param nT
 *      A parameter in [0,1] representing the width of the generated bars.
 *  @return SVGPathElement
 *      A svg <path> element representing a multi-bars.
 */
CheckerBoardWipePath.prototype.perform = function( nT )
{
    var d = pruneScaleValue(1.0 / this.unitsPerEdge);
    var aMatrix = SVGIdentityMatrix.scaleNonUniform(pruneScaleValue( d*2.0*nT ),
                                                    pruneScaleValue( d ) );

    var aPolyPath = null;
    var i, j;
    var aTransform;
    var aPath;
    for ( i = this.unitsPerEdge; i--; )
    {
        aTransform = SVGIdentityMatrix;

        if ((i % 2) == 1) // odd line
            aTransform = aTransform.translate( -d, 0.0 );

        aTransform = aTransform.multiply( aMatrix );

        for ( j = (this.unitsPerEdge / 2) + 1; j--;)
        {
            aPath = this.aBasePath.cloneNode( true );
            aPath.matrixTransform( aTransform );
            if (aPolyPath == null) aPolyPath = aPath;
            else aPolyPath.appendPath( aPath );
            aTransform = SVGIdentityMatrix.translate( d*2.0, 0.0 ).multiply( aTransform );
        }

        aMatrix = SVGIdentityMatrix.translate( 0.0, d ).multiply( aMatrix ); // next line
    }

    return aPolyPath;
};



/** Class RandomWipePath
 *
 *  @param nElements
 *     The number of bars or cells to be used.
 *  @param bRandomBars
 *     true: generates a horizontal random bar wipe
 *     false: generates a dissolve wipe
 */
export function RandomWipePath( nElements, bRandomBars )
{
    this.nElements = nElements;
    this.aBasePath = createUnitSquarePath();
    this.aPositionArray = new Array( nElements );
    this.aClipPath = createEmptyPath();
    this.nAlreadyAppendedElements = 0;

    var fEdgeLength, nPos, aTransform;

    if( bRandomBars ) // random bar wipe
    {
        fEdgeLength = 1.0 / nElements;
        for( nPos = 0; nPos < nElements; ++nPos )
        {
            this.aPositionArray[nPos] = { x: 0.0, y: pruneScaleValue( nPos * fEdgeLength ) }
        }
        aTransform = SVGIdentityMatrix.scaleNonUniform( 1.0, pruneScaleValue( fEdgeLength ) );
    }
    else // dissolve wipe
    {
        var nSqrtElements = Math.round( Math.sqrt( nElements ) );
        fEdgeLength = 1.0 / nSqrtElements;
        for( nPos = 0; nPos < nElements; ++nPos )
        {
            this.aPositionArray[nPos] = {
                x: pruneScaleValue( ( nPos % nSqrtElements ) * fEdgeLength ),
                y: pruneScaleValue( ( nPos / nSqrtElements ) * fEdgeLength ) }
        }
        aTransform = SVGIdentityMatrix.scale( pruneScaleValue( fEdgeLength ) );
    }
    this.aBasePath.matrixTransform( aTransform );

    var nPos1, nPos2;
    var tmp;
    for( nPos1 = nElements - 1; nPos1 > 0; --nPos1 )
    {
        nPos2 = getRandomInt( nPos1 + 1 );
        tmp = this.aPositionArray[nPos1];
        this.aPositionArray[nPos1] = this.aPositionArray[nPos2];
        this.aPositionArray[nPos2] = tmp;
    }
}

/** perform
 *
 *  @param nT
 *      A parameter in [0,1] representing the width of the generated bars or squares.
 *  @return SVGPathElement
 *      A svg <path> element representing a multi bars or a multi squared cells.
 */
RandomWipePath.prototype.perform = function( nT )
{
    var aPolyPath = createEmptyPath();
    var aPoint;
    var aPath;
    var aTransform;
    var nElements = Math.round( nT * this.nElements );
    if( nElements === 0 )
    {
        return aPolyPath;
    }
    // check if we need to reset the clip path
    if( this.nAlreadyAppendedElements >= nElements )
    {
        this.nAlreadyAppendedElements = 0;
        this.aClipPath = createEmptyPath();
    }
    var nPos;
    for( nPos = this.nAlreadyAppendedElements; nPos < nElements; ++nPos )
    {
        aPoint = this.aPositionArray[nPos];
        aPath = this.aBasePath.cloneNode( true );
        aTransform = SVGIdentityMatrix.translate( aPoint.x, aPoint.y );
        aPath.matrixTransform( aTransform );
        aPolyPath.appendPath( aPath );
    }

    this.nAlreadyAppendedElements = nElements;
    this.aClipPath.appendPath( aPolyPath );

    return this.aClipPath.cloneNode( true );
};

/** Class SnakeWipeSlide
 *
 *  @param nElements
 *  @param bDiagonal
 *  @param bFlipOnYaxis
 */
export function SnakeWipePath(nElements, bDiagonal, bflipOnYAxis)
{
    this.sqrtElements = Math.floor(Math.sqrt(nElements));
    this.elementEdge  = (1.0 / this.sqrtElements);
    this.diagonal     = bDiagonal;
    this.flipOnYAxis  = bflipOnYAxis;
    this.aBasePath    = createUnitSquarePath();
}

SnakeWipePath.prototype.calcSnake = function(t)
{
    var aPolyPath = createEmptyPath();
    const area   = (t * this.sqrtElements * this.sqrtElements);
    const line_  = Math.floor(area) / this.sqrtElements;
    const line   = pruneScaleValue(line_ / this.sqrtElements);
    const col    = pruneScaleValue((area - (line_ * this.sqrtElements)) / this.sqrtElements);

    if(line != 0) {
        let aPath = 'M '+ 0.0 + ' ' + 0.0 + ' ';
        aPath += 'L ' + 0.0 + ' ' + line + ' ';
        aPath += 'L ' + 1.0 + ' ' + line + ' ';
        aPath += 'L ' + 1.0 + ' ' + 0.0 + ' ';
        aPath += 'L 0 0 ';
        let poly = document.createElementNS( NSS['svg'], 'path');
        poly.setAttribute('d', aPath);
        aPolyPath.appendPath(poly);
    }
    if(col != 0) {
        var offset = 0.0;
        if((line_ & 1) == 1) {
            // odd line: => right to left
            offset = (1.0 - col);
        }
        let aPath = 'M ' + offset + ' ' + line + ' ';
        aPath += 'L '+ offset + ' ' + (line + this.elementEdge) + ' ';
        aPath += 'L ' + (offset+col) + ' ' + (line + this.elementEdge) + ' ';
        aPath += 'L ' + (offset+col) + ' ' + line + ' ';
        aPath += 'L ' + offset + ' ' + line + ' ';
        let poly = document.createElementNS( NSS['svg'], 'path');
        poly.setAttribute('d', aPath);
        aPolyPath.appendPath(poly);
    }

    return aPolyPath;
}

SnakeWipePath.prototype.calcHalfDiagonalSnake = function(nT, bIn) {
    var res = createEmptyPath();

    if(bIn) {
        const sqrtArea2 = Math.sqrt(nT * this.sqrtElements * this.sqrtElements);
        const edge = pruneScaleValue(sqrtArea2 / this.sqrtElements);

        var aPath, aPoint = document.documentElement.createSVGPoint();
        if(edge) {
            aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.y = edge;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.x = edge;
            aPoint.y = 0.0;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.x = 0.0;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            const poly = document.createElementNS( NSS['svg'], 'path');
            poly.setAttribute('d', aPath);
            res.appendPath(poly);
        }
        const a = (Math.SQRT1_2 / this.sqrtElements);
        const d = (sqrtArea2 - Math.floor(sqrtArea2));
        const len = (nT * Math.SQRT1_2 * d);
        const height = pruneScaleValue(Math.SQRT1_2 / this.sqrtElements);
        aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.y = height;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.x = len + a;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.y = 0.0;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.x = 0.0;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        const poly = document.createElementNS( NSS['svg'], 'path');
        poly.setAttribute('d', aPath);
        let aTransform;

        if((Math.floor(sqrtArea2) & 1) == 1) {
            // odd line
            aTransform = SVGIdentityMatrix.rotate((Math.PI)/2 + (Math.PI)/4);
            aTransform.translate(edge + this.elementEdge, 0.0);
        }
        else {
            aTransform = SVGIdentityMatrix.translate(-a, 0.0);
            aTransform.rotate(-(Math.PI/4));
            aTransform.translate(0.0, edge);
        }

        poly.matrixTransform(aTransform);
        res.appendPath(poly);
    }
    else { //out
        const sqrtArea2 = Math.sqrt(nT * this.sqrtElements * this.sqrtElements);
        const edge = pruneScaleValue(Math.floor(sqrtArea2)/this.sqrtElements);

        let aPath, aPoint = document.documentElement.createSVGPoint();
        if(edge != 0) {
            aPoint.y = 1.0;
            aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.x = edge;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.x = 1.0;
            aPoint.y = edge;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.y = 0.0;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            aPoint.x = 0.0;
            aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
            const poly = document.createElementNS( NSS['svg'], 'path');
            poly.setAttribute('d', aPath);
            res.appendPath(poly);
        }
        const a = (Math.SQRT1_2 / this.sqrtElements);
        const d = (sqrtArea2 - Math.floor(sqrtArea2));
        const len = ((1.0 - nT) * Math.SQRT2 * d);
        const height = pruneScaleValue(Math.SQRT1_2 / this.sqrtElements);
        aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.y = height;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.x = len + a;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.y = 0.0;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        aPoint.x = 0.0;
        aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
        const poly = document.createElementNS( NSS['svg'], 'path');
        poly.setAttribute('d', aPath);
        let aTransform;

        if((Math.floor(sqrtArea2) & 1) == 1) {
            // odd line
            aTransform = SVGIdentityMatrix.translate(0.0, -height);
            aTransform.rotate(Math.PI/2 + Math.PI/4);
            aTransform.translate(1.0, edge);
        }
        else {
            aTransform = SVGIdentityMatrix.rotate(-(Math.PI/4));
            aTransform = aTransform.translate(edge, 1.0);
        }
        poly.matrixTransform(aTransform);
        res.appendPath(poly);
    }
    return res;
}

SnakeWipePath.prototype.perform = function(nT) {
    var res = createEmptyPath();
    if(this.diagonal) {
        if(nT >= 0.5) {
            res.appendPath(this.calcHalfDiagonalSnake(1.0, true));
            res.appendPath(this.calcHalfDiagonalSnake(2.0*(nT-0.5), false));
        }
        else
            res.appendPath(this.calcHalfDiagonalSnake(2.0*nT, true));
    }
    else
        res = this.calcSnake(nT);

    return this.flipOnYAxis ? flipOnYAxis(res) : res;
}

/** Class ParallelSnakesWipePath
 *  Generates a parallel snakes wipe:
 *
 *  @param nElements
 *  @param bDiagonal
 *  @param bFlipOnYAxis
 *  @param bOpposite
 */
export function ParallelSnakesWipePath(nElements, bDiagonal, bFlipOnYAxis, bOpposite) {
    SnakeWipePath.call(this, nElements, bDiagonal, bFlipOnYAxis);
    this.bOpposite = bOpposite;
}

ParallelSnakesWipePath.prototype = Object.create(SnakeWipePath);

ParallelSnakesWipePath.prototype.perform = function( nT ) {
    var res = createEmptyPath(), half, aTransform;
    if(this.diagonal) {
        assert(this.bOpposite);
        half = SnakeWipePath.prototype.calcHalfDiagonalSnake.call(this, nT, false);
        // flip on x axis and rotate 90 degrees:
        aTransform = SVGIdentityMatrix.scale(1, -1);
        aTransform.translate(-0.5, 0.5);
        aTransform.rotate(Math.PI/2);
        aTransform.translate(0.5, 0.5);
        half.matrixTransform(aTransform);
        half.changeOrientation();
        res.appendPath(half);

        // rotate 180 degrees:
        aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
        aTransform.rotate(Math.PI);
        aTransform.translate(0.5, 0.5);
        half.matrixTransform(aTransform);
        res.appendPath(half);
    }
    else {
        half = SnakeWipePath.prototype.calcSnake.call(this, nT / 2.0 );
        // rotate 90 degrees
        aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
        aTransform = aTransform.rotate(Math.PI/2);
        aTransform = aTransform.translate(0.5, 0.5);
        half.matrixTransform(aTransform);
        res.appendPath(flipOnYAxis(half));
        res.appendPath(this.bOpposite ? flipOnXAxis(half) : half);
    }

    return this.flipOnYAxis ? flipOnYAxis(res) : res;
}

/** SpiralWipePath
 *
 *  @param nElements
 *      number of elements in the spiral animation
 *  @param bFlipOnYAxis
 *      boolean value indicating whether to flip on y-axis or not.
 */
export function SpiralWipePath(nElements, bFlipOnYAxis) {
    this.nElements    = nElements;
    this.sqrtElements = Math.floor(Math.sqrt(nElements));
    this.bFlipOnYAxis = bFlipOnYAxis;
}

SpiralWipePath.prototype.calcNegSpiral = function( nT ) {
    var area  = nT * this.nElements;
    var e     = (Math.sqrt(area) / 2.0);
    var edge  = Math.floor(e) * 2;

    var aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    var edge_ = pruneScaleValue(edge / this.sqrtElements);

    aTransform = aTransform.scale(edge_, edge_);
    aTransform = aTransform.translate(0.5, 0.5);
    var poly = createUnitSquarePath();
    poly.matrixTransform(aTransform);
    var res = poly.cloneNode(true);

    if(1.0 - nT != 0) {
        var edge1 = edge + 1;
        var len   = Math.floor( (e - edge/2) * edge1 * 4);
        var w     = Math.PI / 2;

        while(len > 0) {
            var alen = Math.min(len, edge1);
            len -= alen;
            poly = createUnitSquarePath();
            aTransform = SVGIdentityMatrix.scale(
                            pruneScaleValue( alen / this.sqrtElements ),
                            pruneScaleValue( 1.0 / this.sqrtElements ));
            aTransform = aTransform.translate(
                            - pruneScaleValue( (edge / 2) / this.sqrtElements ),
                            pruneScaleValue( (edge / 2) / this.sqrtElements ));
            aTransform = aTransform.rotate( w );
            w -= Math.PI / 2;
            aTransform = aTransform.translate(0.5, 0.5);
            poly.matrixTransform(aTransform);
            res.appendPath(poly);
        }
    }

    return res;
}

SpiralWipePath.prototype.perform = function( nT ) {
    var res         = createUnitSquarePath();
    var innerSpiral = this.calcNegSpiral( 1.0 - nT );
    innerSpiral.changeOrientation();
    res.appendPath(innerSpiral);

    return this.bFlipOnYAxis ? flipOnYAxis(res) : res;
}

/** Class BoxSnakesWipePath
 *  Generates a twoBoxLeft or fourBoxHorizontal wipe:
 *
 */
export function BoxSnakesWipePath(nElements, bFourBox) {
    SpiralWipePath.call(this, nElements);
    this.bFourBox = bFourBox;
}

BoxSnakesWipePath.prototype = Object.create(SpiralWipePath);

BoxSnakesWipePath.prototype.perform = function( nT ) {
    var res = createUnitSquarePath(), aTransform;
    var innerSpiral = SpiralWipePath.prototype.calcNegSpiral.call(this, 1.0 - nT);
    innerSpiral.changeOrientation();

    if(this.bFourBox) {
        aTransform = SVGIdentityMatrix.scale(0.5, 0.5);
        innerSpiral.matrixTransform(aTransform);
        res.appendPath(innerSpiral);
        res.appendPath(flipOnXAxis(innerSpiral));
        innerSpiral = flipOnYAxis(innerSpiral);
        res.appendPath(innerSpiral);
        res.appendPath(flipOnXAxis(innerSpiral));
    }
    else {
        aTransform = SVGIdentityMatrix.scale(1.0, 0.5);
        innerSpiral.matrixTransform(aTransform);
        res.appendPath(innerSpiral);
        res.appendPath(flipOnXAxis(innerSpiral));
    }
    return this.bFlipOnYAxis ? flipOnYAxis(res) : res;
}

/** Class VeeWipePath
  *
  */
export function VeeWipePath() { }

VeeWipePath.prototype.perform = function( nT ) {
    const d = pruneScaleValue(2.0 * nT);
    var polyPath = 'M ' + 0.0 + ' ' + -1.0 + ' ';
    polyPath += 'L ' + 0.0 + ' ' + (d - 1.0) + ' ';
    polyPath += 'L ' + 0.5 + ' ' + d + ' ';
    polyPath += 'L ' + 1.0 + ' ' + (d - 1.0) + ' ';
    polyPath += 'L ' + 1.0 + ' ' + -1.0 + ' ';
    polyPath += 'L ' + 0.0 + ' ' + -1.0 + ' ';

    var aPolyPolyPath = document.createElementNS( NSS['svg'], 'path');
    aPolyPolyPath.setAttribute('d', polyPath);
    return aPolyPolyPath;
}


