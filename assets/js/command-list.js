const command_holder = document.getElementById("commands");
const command_template = document.getElementById("command-template");

async function FetchCommands() {
  try {
    let commands = fetch("https://bot.shapes.lol/commands");
    commands = commands.json();
    commands.forEach((cmd) => {
      const cmd_clone = command_template.cloneNode(true);

      console.log(cmd.name);
      console.log(cmd.description);

      cmd_clone.querySelector("#command-name").textContent = cmd.name;
      cmd_clone.querySelector("#command-description").textContent =
        cmd.description;

      cmd_clone.hidden = false;
      command_container.appendChild(cmd_clone);
    });
  } catch (e) {
    console.error("Failed To Get Commands:", e);
  }
}

FetchCommands();