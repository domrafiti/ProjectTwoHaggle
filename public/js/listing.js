const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#listing-name').value.trim();
  const lookingFor = document.querySelector('#listing-desc').value.trim();
  const description = document.querySelector('#project-desc').value.trim();
  const category = document.querySelector('#listing-category').value.trim();

  if (name && lookingFor && description && category) {
    //need updated route
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, lookingFor, description, category }),
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
  .getElementById('listing-create')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler);
