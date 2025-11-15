
const signupForm = document.getElementById('signupForm')
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const submitBtn = signupForm.querySelector('button[type="submit"]')
        const originalText = submitBtn.textContent
        submitBtn.textContent = 'Creating account...'
        submitBtn.disabled = true
        
        const formData = new FormData(signupForm)
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        }
        
        
        const existingMsg = signupForm.querySelector('.message')
        if (existingMsg) existingMsg.remove()
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            
            const result = await response.json()
            
            const messageDiv = document.createElement('div')
            messageDiv.className = 'message'
            messageDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center;'
            
            if (response.ok) {
                messageDiv.style.background = '#d4edda'
                messageDiv.style.color = '#155724'
                messageDiv.textContent = '✓ Account created successfully! Redirecting to sign in...'
                signupForm.insertBefore(messageDiv, signupForm.firstChild)
                
                setTimeout(() => {
                    window.location.href = '/signin'
                }, 2000)
            } else {
                messageDiv.style.background = '#f8d7da'
                messageDiv.style.color = '#721c24'
                messageDiv.textContent = '✕ ' + (result.error || 'Error creating account')
                signupForm.insertBefore(messageDiv, signupForm.firstChild)
                
                submitBtn.textContent = originalText
                submitBtn.disabled = false
            }
        } catch (error) {
            console.error('Error:', error)
            const messageDiv = document.createElement('div')
            messageDiv.className = 'message'
            messageDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center; background: #f8d7da; color: #721c24;'
            messageDiv.textContent = '✕ Error creating account'
            signupForm.insertBefore(messageDiv, signupForm.firstChild)
            
            submitBtn.textContent = originalText
            submitBtn.disabled = false
        }
    })
}


const signinForm = document.getElementById('signinForm')
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const submitBtn = signinForm.querySelector('button[type="submit"]')
        const originalText = submitBtn.textContent
        submitBtn.textContent = 'Signing in...'
        submitBtn.disabled = true
        
        const formData = new FormData(signinForm)
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        }
        
        
        const existingMsg = signinForm.querySelector('.message')
        if (existingMsg) existingMsg.remove()
        
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            
            const result = await response.json()
            
            const messageDiv = document.createElement('div')
            messageDiv.className = 'message'
            messageDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center;'
            
            if (response.ok) {
                messageDiv.style.background = '#d4edda'
                messageDiv.style.color = '#155724'
                messageDiv.textContent = '✓ Signed in successfully! Redirecting...'
                signinForm.insertBefore(messageDiv, signinForm.firstChild)
                
                setTimeout(() => {
                    window.location.href = '/'
                }, 1500)
            } else {
                messageDiv.style.background = '#f8d7da'
                messageDiv.style.color = '#721c24'
                messageDiv.textContent = '✕ ' + (result.error || 'Error signing in')
                signinForm.insertBefore(messageDiv, signinForm.firstChild)
                
                submitBtn.textContent = originalText
                submitBtn.disabled = false
            }
        } catch (error) {
            console.error('Error:', error)
            const messageDiv = document.createElement('div')
            messageDiv.className = 'message'
            messageDiv.style.cssText = 'padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center; background: #f8d7da; color: #721c24;'
            messageDiv.textContent = '✕ Error signing in'
            signinForm.insertBefore(messageDiv, signinForm.firstChild)
            
            submitBtn.textContent = originalText
            submitBtn.disabled = false
        }
    })
}
