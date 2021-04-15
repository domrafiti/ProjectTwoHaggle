const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#listing-name').value.trim();
  // const lookingFor = document.querySelector('#looking-for').value.trim();
  const description = document.querySelector('#listing-desc').value.trim();
  const category_id = document.querySelector('#listing-category').value.trim();
  const status_id = document.querySelector('#listing-status').value.trim();
  console.log('am i here?');
  if (title && description && category_id && status_id) {
    //need updated route
    console.log('or here?');
    const response = await fetch(`/api/listings`, {
      method: 'POST',
      body: JSON.stringify({ title, description, category_id, status_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

//update needed

//feedback

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');
    //need updated route
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler);


//----------------------------UPLOAD CODE STARTS HERE------------//
//--------------------------UPLOAD CODE ENDS HERE--------------------------------------//