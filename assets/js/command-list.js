const command_holder = document.getElementById("commands");
const command_template = document.getElementById("command-template");

async function FetchCommands() {
  try {
    const data = await fetch("https://bot.shapes.lol/commands");
    const { Commands } = await data.json();

    // Check if 'Commands' is an object and not null
    if (typeof Commands !== 'object' || Commands === null) {
      throw new Error('The fetched data is not a valid object.');
    }

    // Iterate over the commands object
    for (const cmdKey in Commands) {
      const cmd = Commands[cmdKey];  // Get the individual command object

      const cmd_clone = command_template.cloneNode(true);

      console.log(cmd.name);
      console.log(cmd.description);

      // Modify the command type and name based on the type
      if (cmd.type === "slash_command") {
        cmd.type = "Slash"
        cmd.name = "/" + cmd.name;
      } 
      if (cmd.type === "context_menu_command") {
        cmd.type = "Menu"
        cmd.name = "Right Click User/Message To Use " + cmd.name;
      }

      // Set the values in the cloned template
      cmd_clone.querySelector("#command-name").textContent = cmd.name || "No name";
      cmd_clone.querySelector("#command-description").textContent = cmd.description || "No description";
      cmd_clone.querySelector("#command-type").textContent = cmd.type || "No type";
      cmd_clone.hidden = false;
      command_holder.appendChild(cmd_clone);
    }

  } catch (e) {
    console.error("Failed To Get Commands:", e);
  }
}

FetchCommands();