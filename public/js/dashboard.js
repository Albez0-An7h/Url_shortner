
async function loadLinks() {
    try {
        const response = await fetch('/api/url/my-links')
        const data = await response.json()
        const container = document.getElementById('linksContainer')
        if (!response.ok) {
            container.innerHTML = '<p class="error">Error loading links. Please try again.</p>'
            return
        }
        if (data.links.length === 0) {
            container.innerHTML = '<p class="no-links">You haven\'t created any links yet. <a href="/">Create your first link</a></p>'
            return
        }
        container.innerHTML = data.links.map(link => {
            const shortUrl = `${window.location.origin}/api/url/${link.shortId}`
            const createdDate = new Date(link.createdAt).toLocaleDateString()
            const clicks = link.visitHistory.length
            return `
                <div class="link-card">
                    <div class="link-header">
                        <div class="link-info">
                            <div class="short-url">
                                <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                                ${link.isPrivate ? '<span class="private-badge">🔒 Private</span>' : ''}
                            </div>
                            <div class="original-url">${link.redirectURL}</div>
                        </div>
                        <div class="link-actions">
                            <button onclick="copyLink('${shortUrl}')" class="btn-copy">Copy</button>
                            <button onclick="expireLink('${link.shortId}')" class="btn-delete">Delete</button>
                        </div>
                    </div>
                    <div class="link-stats">
                        <span>📊 ${clicks} clicks</span>
                        <span>📅 Created: ${createdDate}</span>
                    </div>
                </div>
            `
        }).join('')
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('linksContainer').innerHTML = '<p class="error">Error loading links.</p>'
    }
}

function copyLink(url) {
    const btn = event.target
    const originalText = btn.textContent

    navigator.clipboard.writeText(url).then(() => {
        btn.textContent = 'Copied!'
        btn.style.background = '#20c997'
        setTimeout(() => {
            btn.textContent = originalText
            btn.style.background = '#28a745'
        }, 2000)
    }).catch(err => {
        console.error('Error copying:', err)
        btn.textContent = 'Error'
        setTimeout(() => {
            btn.textContent = originalText
        }, 2000)
    })
}

async function expireLink(shortId) {
    const linkCard = event.target.closest('.link-card')


    const confirmDiv = document.createElement('div')
    confirmDiv.style.cssText = 'background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-top: 10px; border: 2px solid #ffc107;'
    confirmDiv.innerHTML = `
        <div style="margin-bottom: 10px;">⚠️ Are you sure you want to delete this link? This action cannot be undone.</div>
        <button onclick="confirmDelete('${shortId}')" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 5px; margin-right: 10px; cursor: pointer; font-weight: 600;">Delete</button>
        <button onclick="this.parentElement.remove()" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 600;">Cancel</button>
    `


    const existingConfirm = linkCard.querySelector('[style*="fff3cd"]')
    if (existingConfirm) existingConfirm.remove()

    linkCard.appendChild(confirmDiv)
}

async function confirmDelete(shortId) {
    const linkCard = event.target.closest('.link-card')

    try {
        const response = await fetch(`/api/url/expire/${shortId}`, {
            method: 'DELETE'
        })
        const data = await response.json()
        if (response.ok) {

            linkCard.innerHTML = '<div style="padding: 20px; text-align: center; color: #155724; background: #d4edda; border-radius: 8px;">✓ Link deleted successfully</div>'


            setTimeout(() => {
                loadLinks()
            }, 2000)
        } else {

            const errorDiv = document.createElement('div')
            errorDiv.style.cssText = 'padding: 10px; margin-top: 10px; background: #f8d7da; color: #721c24; border-radius: 5px;'
            errorDiv.textContent = data.error || 'Error deleting link'
            linkCard.appendChild(errorDiv)

            setTimeout(() => errorDiv.remove(), 3000)
        }
    } catch (error) {
        console.error('Error:', error)
        const errorDiv = document.createElement('div')
        errorDiv.style.cssText = 'padding: 10px; margin-top: 10px; background: #f8d7da; color: #721c24; border-radius: 5px;'
        errorDiv.textContent = 'Error deleting link'
        linkCard.appendChild(errorDiv)

        setTimeout(() => errorDiv.remove(), 3000)
    }
}


loadLinks()


const dashboardUrlForm = document.getElementById('dashboardUrlForm')
if (dashboardUrlForm) {
    const dashboardIsPrivateCheckbox = document.getElementById('dashboardIsPrivate')
    const dashboardPasswordField = document.getElementById('dashboardPasswordField')

    dashboardIsPrivateCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            dashboardPasswordField.classList.remove('hidden')
        } else {
            dashboardPasswordField.classList.add('hidden')
            document.getElementById('dashboardLinkPassword').value = ''
        }
    })

    dashboardUrlForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const urlInput = document.getElementById('dashboardUrlInput')
        const url = urlInput.value
        const isPrivate = document.getElementById('dashboardIsPrivate').checked
        const password = document.getElementById('dashboardLinkPassword').value

        if (isPrivate && !password) {
            const errorDiv = document.createElement('div')
            errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 10px; text-align: center; background: #f8d7da; color: #721c24;'
            errorDiv.textContent = '✕ Please enter a password for the private link'

            const existingError = dashboardPasswordField.querySelector('.inline-error')
            if (existingError) existingError.remove()

            errorDiv.className = 'inline-error'
            dashboardPasswordField.appendChild(errorDiv)

            setTimeout(() => errorDiv.remove(), 3000)
            return
        }

        const requestBody = { url }
        if (isPrivate) {
            requestBody.isPrivate = true
            requestBody.password = password
        }

        const submitBtn = dashboardUrlForm.querySelector('button[type="submit"]')
        const originalText = submitBtn.textContent
        submitBtn.textContent = 'Creating...'
        submitBtn.disabled = true

        try {
            const response = await fetch('/api/url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            const data = await response.json()

            if (data.id) {

                const successDiv = document.createElement('div')
                successDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; background: #d4edda; color: #155724;'
                successDiv.textContent = '✓ Short link created successfully!'

                const existingMsg = dashboardUrlForm.querySelector('.success-msg')
                if (existingMsg) existingMsg.remove()

                successDiv.className = 'success-msg'
                dashboardUrlForm.appendChild(successDiv)


                urlInput.value = ''
                document.getElementById('dashboardIsPrivate').checked = false
                document.getElementById('dashboardLinkPassword').value = ''
                dashboardPasswordField.classList.add('hidden')


                setTimeout(() => {
                    successDiv.remove()
                    loadLinks()
                }, 2000)
            } else if (data.error) {
                const errorDiv = document.createElement('div')
                errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; background: #f8d7da; color: #721c24;'
                errorDiv.textContent = '✕ ' + data.error

                dashboardUrlForm.appendChild(errorDiv)
                setTimeout(() => errorDiv.remove(), 3000)
            }

            submitBtn.textContent = originalText
            submitBtn.disabled = false
        } catch (error) {
            console.error('Error:', error)
            const errorDiv = document.createElement('div')
            errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; background: #f8d7da; color: #721c24;'
            errorDiv.textContent = '✕ Error creating short URL'

            dashboardUrlForm.appendChild(errorDiv)
            setTimeout(() => errorDiv.remove(), 3000)

            submitBtn.textContent = originalText
            submitBtn.disabled = false
        }
    })
}
