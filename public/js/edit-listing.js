const editListingFormHandler = async (event) => {
  event.preventDefault();
  const id = document.querySelector('#edit-listing-id').value.trim();
  const title = document.querySelector('#edit-listing-name').value.trim();
  const description = document.querySelector('#edit-listing-desc').value.trim();
  const category_id = document.querySelector(
    'input[name="edit-listing-category"]:checked'
  ).value;
  const status_id = document.querySelector(
    'input[name="edit-listing-status"]:checked'
  ).value;
  console.log('am i here?');
  if (id && title && description && category_id && status_id) {
    //need updated route
    console.log('or here?');
    const response = await fetch(`/api/listing/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, title, description, category_id, status_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/listing/${id}`);
    } else {
      alert('Failed to update listing');
    }
  }
};

//update needed

//feedback

// const delButtonHandler = async (event) => {
//   if (event.target.hasAttribute('data-id')) {
//     const id = event.target.getAttribute('data-id');
//     //need updated route
//     const response = await fetch(`/api/projects/${id}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       document.location.replace('/profile');
//     } else {
//       alert('Failed to delete project');
//     }
//   }
// };

const showListingEdit = () => {
  document.querySelector('#listing-div').style.display = 'none';
  document.querySelector('#listing-div-edit').style.display = 'block';
};

document
  .querySelector('.edit-listing-form')
  .addEventListener('submit', editListingFormHandler);

document
  .querySelector('#listing-edit-show')
  .addEventListener('click', showListingEdit);
