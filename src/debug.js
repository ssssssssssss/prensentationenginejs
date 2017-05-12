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
