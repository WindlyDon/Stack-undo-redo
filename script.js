document.addEventListener("DOMContentLoaded", function () {
    console.log("Stack application JavaScript loaded successfully.");

    const editor = document.getElementById("editor");
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const clearBtn = document.getElementById("clearBtn");
    const status = document.getElementById("status");

    const undoStackElement = document.getElementById("undoStack");
    const redoStackElement = document.getElementById("redoStack");

    // Check that all required HTML elements exist.
    if (
        !editor ||
        !undoBtn ||
        !redoBtn ||
        !clearBtn ||
        !status ||
        !undoStackElement ||
        !redoStackElement
    ) {
        console.error(
            "Application error: One or more HTML elements could not be found."
        );
        return;
    }

    // Two stacks implementing LIFO.
    const undoStack = [];
    const redoStack = [];

    const MAX_HISTORY = 100;

    let lastSavedText = editor.value;

    function push(stack, value) {
        stack.push(value);

        if (stack.length > MAX_HISTORY) {
            stack.shift();
        }
    }

    function pop(stack) {
        return stack.pop();
    }

    function renderStack(container, stack, label) {
        container.replaceChildren();

        if (stack.length === 0) {
            const message = document.createElement("p");
            message.className = "empty";
            message.textContent = "No saved states yet.";
            container.appendChild(message);
            return;
        }

        // Show the top of the stack first.
        for (let i = stack.length - 1; i >= 0; i--) {
            const item = document.createElement("div");
            item.className = "stack-item";

            if (i === stack.length - 1) {
                item.classList.add("top");
            }

            const heading = document.createElement("small");
            heading.textContent =
                i === stack.length - 1
                    ? label + " — TOP (next to pop)"
                    : label + " — Entry " + (i + 1);

            const content = document.createElement("div");
            content.textContent = stack[i] || "(Empty text)";

            item.append(heading, content);
            container.appendChild(item);
        }
    }

    function updateInterface() {
        undoBtn.disabled = undoStack.length === 0;
        redoBtn.disabled = redoStack.length === 0;

        renderStack(undoStackElement, undoStack, "Undo");
        renderStack(redoStackElement, redoStack, "Redo");
    }

    // Record every text change.
    editor.addEventListener("input", function () {
        if (editor.value === lastSavedText) {
            return;
        }

        push(undoStack, lastSavedText);

        lastSavedText = editor.value;

        // A new edit clears the redo history.
        redoStack.length = 0;

        updateInterface();

        status.textContent = "Edit saved. You can undo this change.";

        console.log("Edit recorded. Undo stack:", undoStack);
    });

    // Undo the last edit.
    undoBtn.addEventListener("click", function () {
        if (undoStack.length === 0) {
            status.textContent = "Nothing to undo.";
            return;
        }

        push(redoStack, editor.value);

        editor.value = pop(undoStack);
        lastSavedText = editor.value;

        updateInterface();

        status.textContent = "Undo successful. Previous text restored.";
    });

    // Redo the last undone edit.
    redoBtn.addEventListener("click", function () {
        if (redoStack.length === 0) {
            status.textContent = "Nothing to redo.";
            return;
        }

        push(undoStack, editor.value);

        editor.value = pop(redoStack);
        lastSavedText = editor.value;

        updateInterface();

        status.textContent = "Redo successful. Text restored.";
    });

    // Clear the editor but preserve undo functionality.
    clearBtn.addEventListener("click", function () {
        if (editor.value === "") {
            status.textContent = "The editor is already empty.";
            return;
        }

        push(undoStack, editor.value);

        editor.value = "";
        lastSavedText = "";

        redoStack.length = 0;

        updateInterface();

        status.textContent =
            "Editor cleared. Click Undo to restore your text.";
    });

    // Initialize the application.
    updateInterface();

    status.textContent = "Ready. Start typing to create your first history entry.";
});