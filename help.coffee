class Help
    constructor: ->
        @injected = false

        window.addEventListener "DOMContentLoaded", =>
            @inject()

    inject: ->
        return if @injected

        @injected = true
        @_injectPopup()
        @_injectButton()

    toggle: (event) =>
        event.preventDefault() if event?
        @inject()
        toggleClass $('tumblr_shortcuts_help'), 'hidden'

    _injectPopup: =>
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
                            <td>v</td><td>view post in a new tab (without loosing afocus)</td>
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
        
    _injectButton: =>
        container = document.createElement 'div'
        container.setAttribute 'class', 'tab iconic'

        button = document.createElement 'a'
        button.setAttribute 'id', 'tumblr_shortcuts_button'
        button.setAttribute 'title', 'Shortcuts'
        button.appendChild document.createTextNode('Shortcuts')
        button.addEventListener 'click', @toggle

        container.appendChild button
        $('user_tools').insertBefore container, $('preferences_button')

