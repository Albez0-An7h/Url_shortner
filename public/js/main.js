const isPrivateCheckbox = document.getElementById('isPrivate')
const passwordField = document.getElementById('passwordField')

isPrivateCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        passwordField.classList.remove('hidden')
    } else {
        passwordField.classList.add('hidden')
        document.getElementById('linkPassword').value = ''
    }
})

document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const urlInput = document.getElementById('urlInput')
    const url = urlInput.value
    const isPrivate = document.getElementById('isPrivate').checked
    const password = document.getElementById('linkPassword').value
    
    if (isPrivate && !password) {
        
    const errorDiv = document.createElement('div')
        errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 10px; text-align: center; background: #f8d7da; color: #721c24;'
        errorDiv.textContent = '✕ Please enter a password for the private link'
        
        const existingError = passwordField.querySelector('.inline-error')
        if (existingError) existingError.remove()
        
        errorDiv.className = 'inline-error'
        passwordField.appendChild(errorDiv)
        
        setTimeout(() => errorDiv.remove(), 3000)
        return
    }
    
    const requestBody = { url }
    if (isPrivate) {
        requestBody.isPrivate = true
        requestBody.password = password
    }
    
    const submitBtn = document.querySelector('#urlForm button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = 'Shortening...'
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
            const shortUrl = `${window.location.origin}/api/url/${data.id}`
            document.getElementById('shortUrl').value = shortUrl
            document.getElementById('analyticsLink').href = `/api/url/analytics/${data.id}`
            document.getElementById('result').classList.remove('hidden')
            
            
        const privacyBadge = document.getElementById('privacyBadge')
            if (data.isPrivate) {
                privacyBadge.classList.remove('hidden')
            } else {
                privacyBadge.classList.add('hidden')
            }
            
            
        urlInput.value = ''
            document.getElementById('isPrivate').checked = false
            document.getElementById('linkPassword').value = ''
            passwordField.classList.add('hidden')
            
            submitBtn.textContent = originalText
            submitBtn.disabled = false
        } else if (data.error) {
            
        const errorDiv = document.createElement('div')
            errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; background: #f8d7da; color: #721c24;'
            errorDiv.textContent = '✕ ' + data.error
            
            const existingError = document.querySelector('#urlForm + div')
            if (existingError && existingError.textContent.includes('✕')) {
                existingError.remove()
            }
            
            document.getElementById('urlForm').parentNode.insertBefore(errorDiv, document.getElementById('urlForm').nextSibling)
            
            setTimeout(() => errorDiv.remove(), 3000)
            
            submitBtn.textContent = originalText
            submitBtn.disabled = false
        } else {
            const errorDiv = document.createElement('div')
            errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; background: #f8d7da; color: #721c24;'
            errorDiv.textContent = '✕ Error creating short URL'
            
            document.getElementById('urlForm').parentNode.insertBefore(errorDiv, document.getElementById('urlForm').nextSibling)
            
            setTimeout(() => errorDiv.remove(), 3000)
            
            submitBtn.textContent = originalText
            submitBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error)
        const errorDiv = document.createElement('div')
        errorDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; background: #f8d7da; color: #721c24;'
        errorDiv.textContent = '✕ Error creating short URL'
        
        document.getElementById('urlForm').parentNode.insertBefore(errorDiv, document.getElementById('urlForm').nextSibling)
        
        setTimeout(() => errorDiv.remove(), 3000)
        
        submitBtn.textContent = originalText
        submitBtn.disabled = false
    }
})

function copyUrl() {
    const shortUrl = document.getElementById('shortUrl')
    shortUrl.select()
    shortUrl.setSelectionRange(0, 99999) 

    navigator.clipboard.writeText(shortUrl.value).then(() => {
        const btn = event.target
        const originalText = btn.textContent
        btn.textContent = 'Copied!'
        btn.style.background = '#20c997'
        
        setTimeout(() => {
            btn.textContent = originalText
            btn.style.background = '#28a745'
        }, 2000)
    }).catch(err => {
        
    document.execCommand('copy')
        const btn = event.target
        const originalText = btn.textContent
        btn.textContent = 'Copied!'
        setTimeout(() => {
            btn.textContent = originalText
        }, 2000)
    })
}
