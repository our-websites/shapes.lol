const command_holder = document.getElementById("commands");
const command_template = document.getElementById("command-template");

async function FetchCommands() {
  try {
    const data = await fetch("https://bot.shapes.lol/commands");
    let commands = await data.json();
    for (const cmd of commands) {
      const cmd_clone = command_template.cloneNode(true);

      console.log(cmd.name);
      console.log(cmd.description);

      if (cmd.type === "slash_command") {
        cmd.type = "Slash"
        cmd.name = "/" + cmd.name
      } 
      if (cmd.type === "context_menu_command") {
        cmd.type = "Menu"
        cmd.name = "Right Click User/Message To Use " + cmd.name
      }

      cmd_clone.querySelector("#command-name").textContent = cmd.name;
      cmd_clone.querySelector("#command-description").textContent = cmd.description;
      cmd_clone.querySelector("#cmmand-type").textContent = cmd.type;

      cmd_clone.hidden = false;
      command_container.appendChild(cmd_clone);
    };
  } catch (e) {
    console.error("Failed To Get Commands:", e);
  }
}

FetchCommands();