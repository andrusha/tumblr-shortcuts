class Help
    constructor: ->
        window.addEventListener "load", =>
            @injectStyles()
            @injectHTML()

    injectStyles: =>
        style = document.createElement 'style'
        style.setAttribute 'type', 'text/css'
        content = document.createTextNode """
            #tumblr_shortcuts_help {
                color: white;
                cursor: pointer;
            }
            #tumblr_shortcuts_help.hidden {
                display: none;
            }
            #tumblr_shortcuts_curtain {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: black;
                opacity: 0.3;
                z-index: 10000;
            }
            #tumblr_shortcuts_popup {
                position: fixed;
                width: 400px;
                top: 150px;
                left: 50%;
                margin-left: -200px;
                background: black;
                opacity: 0.8;
                padding: 30px;
                border-radius: 10px;
                z-index: 20000;
            }
            #tumblr_shortcuts_popup h1, #tumblr_shortcuts_popup h2, #tumblr_shortcuts_popup p {
                color: white;
            }
            #tumblr_shortcuts_popup table tr td:last {
                padding-left: 10px;
            }
        """

        style.appendChild content
        document.head.appendChild style

    injectHTML: =>
        container = document.createElement 'div'
        container.setAttribute 'id', 'tumblr_shortcuts_help'
        container.setAttribute 'class', 'hidden'
        container.innerHTML = """
            <div id="tumblr_shortcuts_curtain"></div>
            <div id="tumblr_shortcuts_popup">
                <h1>Shortcuts</h1>

                <h2>Dashboard</h2>
                <p>
                    <table>
                    <tbody>
                        <tr>
                            <td>j</td><td>next post</td>
                        </tr>
                        <tr>
                            <td>k</td><td>previous post</td>
                        </tr>
                        <tr>
                            <td>l</td><td>like</td>
                        </tr>
                        <tr>
                            <td>r</td><td>reblog</td>
                        </tr>
                        <tr>
                            <td>alt&nbsp;+&nbsp;r</td><td>reblog in a new tab</td>
                        </tr>
                        <tr>
                            <td>v</td><td>view post in a new tab (without loosing focus)</td>
                        </tr>
                        <tr>
                            <td>p</td><td>open current page</td>
                        </tr>
                        <tr>
                            <td>ctrl&nbsp;+&nbsp;enter</td><td>(while writing a reply) send reply</td>
                        </tr>
                    </tbody>
                    </table>
                </p>

                <h2>Reblog page</h2>
                <p>
                    <table>
                    <tbody>
                        <tr>
                            <td>ctrl&nbsp;+&nbsp;enter</td><td>confirm reblogging</td>
                        </tr>
                        <tr>
                            <td>esc</td><td>cancel</td>
                        </tr>
                        <tr>
                            <td>q</td><td>select "add to queue" instead of "publish now"</td>
                        </tr>
                        <tr>
                            <td>alt&nbsp;+&nbsp;q</td><td>place post in the queue</td>
                        </tr>
                        <tr>
                            <td>b</td><td>switch blogs</td>
                        </tr>
                        <tr>
                            <td>alt&nbsp;+&nbsp;b</td><td>switch blog & publish</td>
                        </tr>
                    </tbody>
                    </table>
                </p>

            </div>
        """

        container.addEventListener 'click', @toggle
        document.body.appendChild container

    toggle: =>
        toggleClass $('tumblr_shortcuts_help'), 'hidden'
