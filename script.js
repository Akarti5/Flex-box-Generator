document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const flexContainer = document.getElementById('flexContainer');
    const htmlOutput = document.getElementById('htmlOutput');
    const cssOutput = document.getElementById('cssOutput');
    const jsOutput = document.getElementById('jsOutput');
    const addItemBtn = document.getElementById('addItem');
    const removeItemBtn = document.getElementById('removeItem');
    const tabButtons = document.querySelectorAll('.tab-button');
    const copyButtons = document.querySelectorAll('.copy-button');
    
    // Container controls
    const flexDirection = document.createElement('select');
    const flexWrap = document.createElement('select');
    const justifyContent = document.createElement('select');
    const alignItems = document.createElement('select');
    const alignContent = document.createElement('select');
    
    // Item controls
    const flexGrow = document.createElement('input');
    const flexShrink = document.createElement('input');
    const flexBasis = document.createElement('input');
    const alignSelf = document.createElement('select');
    
    // Initialize controls
    initControls();
    
    // Event listeners
    const controls = [flexDirection, flexWrap, justifyContent, alignItems, alignContent, 
                     flexGrow, flexShrink, flexBasis, alignSelf];
    
    controls.forEach(control => {
        control.addEventListener('change', updateFlexbox);
        control.addEventListener('input', updateFlexbox);
    });
    
    addItemBtn.addEventListener('click', addFlexItem);
    removeItemBtn.addEventListener('click', removeFlexItem);
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.code-tab').forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.closest('.code-tab');
            const code = tab.querySelector('pre').textContent;
            const type = tab.id.replace('Tab', '');
            
            navigator.clipboard.writeText(code).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
            });
        });
    });
    
    function initControls() {
        // Add options for container properties
        addOptions(flexDirection, ['row', 'row-reverse', 'column', 'column-reverse'], 'flex-direction');
        addOptions(flexWrap, ['nowrap', 'wrap', 'wrap-reverse'], 'flex-wrap');
        addOptions(justifyContent, ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'], 'justify-content');
        addOptions(alignItems, ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'], 'align-items');
        addOptions(alignContent, ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'], 'align-content');
        
        // Configure item properties
        flexGrow.type = 'number';
        flexGrow.min = '0';
        flexGrow.value = '0';
        flexGrow.setAttribute('data-property', 'flex-grow');
        
        flexShrink.type = 'number';
        flexShrink.min = '0';
        flexShrink.value = '1';
        flexShrink.setAttribute('data-property', 'flex-shrink');
        
        flexBasis.type = 'text';
        flexBasis.value = 'auto';
        flexBasis.setAttribute('data-property', 'flex-basis');
        
        addOptions(alignSelf, ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'], 'align-self');
        
        // Add container controls
        document.getElementById('containerControls').append(
            createControlRow('Flex Direction', flexDirection),
            createControlRow('Flex Wrap', flexWrap),
            createControlRow('Justify Content', justifyContent),
            createControlRow('Align Items', alignItems),
            createControlRow('Align Content', alignContent)
        );
        
        // Add item controls
        document.getElementById('itemControls').append(
            createControlRow('Flex Grow', flexGrow),
            createControlRow('Flex Shrink', flexShrink),
            createControlRow('Flex Basis', flexBasis),
            createControlRow('Align Self', alignSelf)
        );
    }
    
    function createControlRow(labelText, control) {
        const row = document.createElement('div');
        row.className = 'control-row';
        
        const label = document.createElement('label');
        label.textContent = labelText;
        
        row.append(label, control);
        return row;
    }
    
    function addOptions(selectElement, options, propertyName) {
        selectElement.setAttribute('data-property', propertyName);
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }
    
    function addFlexItem() {
        const items = document.querySelectorAll('.flex-item');
        const newItem = document.createElement('div');
        newItem.className = 'flex-item added';
        newItem.textContent = `Item ${items.length + 1}`;
        flexContainer.appendChild(newItem);
        
        setTimeout(() => {
            newItem.classList.remove('added');
        }, 300);
        
        updateFlexbox();
    }
    
    function removeFlexItem() {
        const items = document.querySelectorAll('.flex-item');
        if (items.length > 1) {
            flexContainer.removeChild(items[items.length - 1]);
            updateFlexbox();
        } else {
            alert("You need at least one flex item!");
        }
    }
    
    function updateFlexbox() {
        // Update container styles
        flexContainer.style.flexDirection = flexDirection.value;
        flexContainer.style.flexWrap = flexWrap.value;
        flexContainer.style.justifyContent = justifyContent.value;
        flexContainer.style.alignItems = alignItems.value;
        flexContainer.style.alignContent = alignContent.value;
        
        // Update item styles
        const items = document.querySelectorAll('.flex-item');
        items.forEach(item => {
            item.style.flexGrow = flexGrow.value;
            item.style.flexShrink = flexShrink.value;
            item.style.flexBasis = flexBasis.value;
            item.style.alignSelf = alignSelf.value;
        });
        
        // Generate code
        generateCode();
    }
    
    function generateCode() {
        // Generate HTML
        const items = document.querySelectorAll('.flex-item');
        let htmlItems = '';
        items.forEach((item, index) => {
            htmlItems += `  <div class="flex-item">Item ${index + 1}</div>\n`;
        });
        
        const htmlCode = `<div class="flex-container">\n${htmlItems}</div>`;
        
        // Generate CSS
        const cssCode = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection.value};
  flex-wrap: ${flexWrap.value};
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};
  align-content: ${alignContent.value};
}

.flex-item {
  flex-grow: ${flexGrow.value};
  flex-shrink: ${flexShrink.value};
  flex-basis: ${flexBasis.value};
  align-self: ${alignSelf.value};
}`;
        

        
        // Display code
        htmlOutput.textContent = htmlCode;
        cssOutput.textContent = cssCode;
        
    }
    
    // Initial update
    updateFlexbox();
});