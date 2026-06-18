document.addEventListener('DOMContentLoaded', () => {
    const allCodeContainers = document.querySelectorAll('.code-container');

    allCodeContainers.forEach(container => {
        const copyBtn = container.querySelector('.copy-btn');
        const codeBlock = container.querySelector('pre code');

        if (copyBtn && codeBlock) {
            copyBtn.addEventListener('click', () => {
                const codeToCopy = codeBlock.innerText;

                // Use Clipboard API if available, otherwise fall back to execCommand
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(codeToCopy).then(() => {
                        copyBtn.innerHTML = '<i class="fa fa-check"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy with Clipboard API: ', err);
                    });
                } else {
                    // Fallback for insecure contexts or older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = codeToCopy;
                    
                    // Make the textarea invisible
                    textArea.style.position = 'absolute';
                    textArea.style.left = '-9999px';
                    
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        copyBtn.innerHTML = '<i class="fa fa-check"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
                        }, 2000);
                    } catch (err) {
                        console.error('Fallback copy failed: ', err);
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            });
        }
    });
});
