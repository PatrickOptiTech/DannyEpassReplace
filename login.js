(function initLogin(){
  const idEl = document.getElementById('login-id');
  const passEl = document.getElementById('login-pass');
  const errEl = document.getElementById('login-error');
  const submit = document.getElementById('login-submit');
  const cancel = document.getElementById('login-cancel');

  async function validateUser(email, password) {
    try {
      // First sign in with Supabase Auth
      const { data: authData, error: authError } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) throw authError;

      // Then get the user details from app_users table
      const { data: userData, error: userError } = await window.supabaseClient
        .from('app_users')
        .select('id, username, display_name, email')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError) throw userError;

      console.log('Login successful:', { authData, userData });
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  submit.addEventListener('click', async () => {
    const email = idEl.value.trim();
    const password = passEl.value;
    
    errEl.hidden = true;
    submit.disabled = true;
    
    try {
      const user = await validateUser(email, password);
      
      if (user) {
        // Pass the complete user object to maintain throughout the session
        window.electron && window.electron.loginSuccess({
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email
        });
      } else {
        errEl.hidden = false;
      }
    } catch (error) {
      console.error('Login error:', error);
      errEl.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });

  cancel.addEventListener('click', () => {
    window.close();
  });

  passEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit.click(); });
})();
