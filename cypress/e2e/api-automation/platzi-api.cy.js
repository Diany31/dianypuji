const apiUrl = 'https://api.escuelajs.co/api/v1';

const placeholderImage = 'https://placehold.co/600x400';
const uniqueName = (prefix) => `${prefix} ${Date.now()}`;

describe('Platzi Fake Store API - Cypress API Automation', () => {
  it('API-001 - GET all categories', () => {
    cy.request('GET', `${apiUrl}/categories`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').and.not.be.empty;
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('image');
    });
  });

  it('API-002 - GET single category by ID', () => {
    cy.request('GET', `${apiUrl}/categories`).then((listResponse) => {
      const category = listResponse.body[0];

      cy.request('GET', `${apiUrl}/categories/${category.id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(category.id);
        expect(response.body.name).to.eq(category.name);
      });
    });
  });

  it('API-003 - GET products by category ID', () => {
    cy.request('GET', `${apiUrl}/categories`).then((listResponse) => {
      const category = listResponse.body[0];

      cy.request('GET', `${apiUrl}/categories/${category.id}/products`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        if (response.body.length > 0) {
          expect(response.body[0].category.id).to.eq(category.id);
          expect(response.body[0].category.name).to.eq(category.name);
        }
      });
    });
  });

  it('API-004 - GET all products', () => {
    cy.request('GET', `${apiUrl}/products`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').and.not.be.empty;
      expect(response.body[0]).to.have.property('title');
      expect(response.body[0]).to.have.property('price');
    });
  });

  it('API-005 - GET single product by ID', () => {
    cy.request('GET', `${apiUrl}/products?offset=0&limit=1`).then((listResponse) => {
      const product = listResponse.body[0];

      cy.request('GET', `${apiUrl}/products/${product.id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(product.id);
        expect(response.body.title).to.eq(product.title);
      });
    });
  });

  it('API-006 - GET products with limit and offset', () => {
    cy.request('GET', `${apiUrl}/products?offset=0&limit=5`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(5);
    });
  });

  it('API-007 - POST create category', () => {
    const categoryName = uniqueName('Diany Category');

    cy.request('POST', `${apiUrl}/categories`, {
      name: categoryName,
      image: placeholderImage
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq(categoryName);
      expect(response.body.image).to.eq(placeholderImage);
    });
  });

  it('API-008 - PUT update category name', () => {
    const categoryName = uniqueName('Diany Category');
    const updatedName = `${categoryName} Updated`;

    cy.request('POST', `${apiUrl}/categories`, {
      name: categoryName,
      image: placeholderImage
    }).then((createResponse) => {
      cy.request('PUT', `${apiUrl}/categories/${createResponse.body.id}`, {
        name: updatedName
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.id).to.eq(createResponse.body.id);
        expect(updateResponse.body.name).to.eq(updatedName);
      });
    });
  });

  it('API-009 - DELETE category', () => {
    const categoryName = uniqueName('Diany Category');

    cy.request('POST', `${apiUrl}/categories`, {
      name: categoryName,
      image: placeholderImage
    }).then((createResponse) => {
      cy.request('DELETE', `${apiUrl}/categories/${createResponse.body.id}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.toString()).to.eq('true');
      });
    });
  });

  it('API-010 - GET all users', () => {
    cy.request('GET', `${apiUrl}/users`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').and.not.be.empty;
      expect(response.body[0]).to.have.property('email');
      expect(response.body[0]).to.have.property('role');
    });
  });

  it('API-011 - POST login user', () => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'admin@mail.com',
      password: 'admin123'
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('access_token');
      expect(response.body).to.have.property('refresh_token');
    });
  });

  it('API-012 - GET product not found returns error response', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/products/999999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
      expect(response.body).to.have.property('message');
      expect(response.body.message.toString()).to.include('Product');
    });
  });
});
