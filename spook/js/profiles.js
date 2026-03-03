{% for username, profile in profiles %}
        document.getElementById("{{username}}").addEventListener("click", function () {
            window.location.href = "/@{{username}}";
        });
        {% endfor %}
