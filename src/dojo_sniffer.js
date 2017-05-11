/*****
 * @licstart
 *
 * The following is the license notice for the part of JavaScript code of this
 * page included between the '@dojostart' and the '@dojoend' notes.
 */

/*****  **********************************************************************
 *
 *  The 'New' BSD License:
 *  **********************
 *  Copyright (c) 2005-2012, The Dojo Foundation
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *    * Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    * Neither the name of the Dojo Foundation nor the names of its contributors
 *      may be used to endorse or promote products derived from this software
 *      without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 *  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 *  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 ****************************************************************************/


/*****
 * @licend
 *
 * The above is the license notice for the part of JavaScript code of this
 * page included between the '@dojostart' and the '@dojoend' notes.
 */



/*****
 * @dojostart
 *
 *  The following code is a derivative work of some part of the dojox.gfx library.
 *  @source http://svn.dojotoolkit.org/src/dojox/trunk/_base/sniff.js
 */

function has( name )
{
    return has.cache[name];
}

has.cache = {};

has.add = function( name, test )
{
    has.cache[name] = test;
};

function configureDetectionTools()
{
    if( !navigator )
    {
        log( 'error: configureDetectionTools: configuration failed' );
        return null;
    }

    var n = navigator,
    dua = n.userAgent,
    dav = n.appVersion,
    tv = parseFloat(dav);

    has.add('air', dua.indexOf('AdobeAIR') >= 0);
    has.add('khtml', dav.indexOf('Konqueror') >= 0 ? tv : undefined);
    has.add('webkit', parseFloat(dua.split('WebKit/')[1]) || undefined);
    has.add('chrome', parseFloat(dua.split('Chrome/')[1]) || undefined);
    has.add('safari', dav.indexOf('Safari')>=0 && !has('chrome') ? parseFloat(dav.split('Version/')[1]) : undefined);
    has.add('mac', dav.indexOf('Macintosh') >= 0);
    has.add('quirks', document.compatMode == 'BackCompat');
    has.add('ios', /iPhone|iPod|iPad/.test(dua));
    has.add('android', parseFloat(dua.split('Android ')[1]) || undefined);

    if(!has('webkit')){
        // Opera
        if(dua.indexOf('Opera') >= 0){
            // see http://dev.opera.com/articles/view/opera-ua-string-changes and http://www.useragentstring.com/pages/Opera/
            // 9.8 has both styles; <9.8, 9.9 only old style
            has.add('opera', tv >= 9.8 ? parseFloat(dua.split('Version/')[1]) || tv : tv);
        }

        // Mozilla and firefox
        if(dua.indexOf('Gecko') >= 0 && !has('khtml') && !has('webkit')){
            has.add('mozilla', tv);
        }
        if(has('mozilla')){
            //We really need to get away from this. Consider a sane isGecko approach for the future.
            has.add('ff', parseFloat(dua.split('Firefox/')[1] || dua.split('Minefield/')[1]) || undefined);
        }

        // IE
        if(document.all && !has('opera')){
            var isIE = parseFloat(dav.split('MSIE ')[1]) || undefined;

            //In cases where the page has an HTTP header or META tag with
            //X-UA-Compatible, then it is in emulation mode.
            //Make sure isIE reflects the desired version.
            //document.documentMode of 5 means quirks mode.
            //Only switch the value if documentMode's major version
            //is different from isIE major version.
            var mode = document.documentMode;
            if(mode && mode != 5 && Math.floor(isIE) != mode){
                isIE = mode;
            }

            has.add('ie', isIE);
        }

        // Wii
        has.add('wii', typeof opera != 'undefined' && opera.wiiremote);
    }

    var detect =
    {
		// isFF: Number|undefined
		//		Version as a Number if client is FireFox. undefined otherwise. Corresponds to
		//		major detected FireFox version (1.5, 2, 3, etc.)
		isFF: has('ff'),

		// isIE: Number|undefined
		//		Version as a Number if client is MSIE(PC). undefined otherwise. Corresponds to
		//		major detected IE version (6, 7, 8, etc.)
		isIE: has('ie'),

		// isKhtml: Number|undefined
		//		Version as a Number if client is a KHTML browser. undefined otherwise. Corresponds to major
		//		detected version.
		isKhtml: has('khtml'),

		// isWebKit: Number|undefined
		//		Version as a Number if client is a WebKit-derived browser (Konqueror,
		//		Safari, Chrome, etc.). undefined otherwise.
		isWebKit: has('webkit'),

		// isMozilla: Number|undefined
		//		Version as a Number if client is a Mozilla-based browser (Firefox,
		//		SeaMonkey). undefined otherwise. Corresponds to major detected version.
		isMozilla: has('mozilla'),
		// isMoz: Number|undefined
		//		Version as a Number if client is a Mozilla-based browser (Firefox,
		//		SeaMonkey). undefined otherwise. Corresponds to major detected version.
		isMoz: has('mozilla'),

		// isOpera: Number|undefined
		//		Version as a Number if client is Opera. undefined otherwise. Corresponds to
		//		major detected version.
		isOpera: has('opera'),

		// isSafari: Number|undefined
		//		Version as a Number if client is Safari or iPhone. undefined otherwise.
		isSafari: has('safari'),

		// isChrome: Number|undefined
		//		Version as a Number if client is Chrome browser. undefined otherwise.
		isChrome: has('chrome'),

		// isMac: Boolean
		//		True if the client runs on Mac
		isMac: has('mac'),

		// isIos: Boolean
		//		True if client is iPhone, iPod, or iPad
		isIos: has('ios'),

		// isAndroid: Number|undefined
		//		Version as a Number if client is android browser. undefined otherwise.
		isAndroid: has('android'),

		// isWii: Boolean
		//		True if client is Wii
		isWii: has('wii'),

		// isQuirks: Boolean
		//		Page is in quirks mode.
		isQuirks: has('quirks'),

		// isAir: Boolean
		//		True if client is Adobe Air
		isAir: has('air')
    };
    return detect;
}

/*****
 * @dojoend
 *
 *  The above code is a derivative work of some part of the dojox.gfx library.
 *  @source http://svn.dojotoolkit.org/src/dojox/trunk/_base/sniff.js
 */
