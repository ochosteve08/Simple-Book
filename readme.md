
# Olist E-Commerce API

This Node.js API provides access to the Olist E-Commerce dataset stored in a MongoDB database. Authentication is done via HTTP Basic using the `seller_id` and `seller_zip_code_prefix` from the `olist_sellers_dataset` collection as the username and password, respectively.

## Getting Started

### Prerequisites

Before running the API, ensure you have the following installed:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ochosteve08/Simple-Book.git
   ```
2. Install dependencies:

   ```bash
   cd olist-api
   npm install
   ```
3. Set up environment variables:

   Create a `.env` file in the root directory with the following content:

   ```env
   MONGO_URL=mongodb://127.0.0.1:27017/yourDatabaseName
   ```

   Replace `yourDatabaseName` with the actual name of your MongoDB database.
4. Start the server:

   ```bash
   npm start
   ```

   The server should now be running at `http://localhost:3000`.

## API Endpoints

### 1. List Order Items

- **Endpoint**: `/order_items`
- **Method**: `GET`
- **Parameters**:
  - `limit` (optional): Number of results to show (default is 20).
  - `offset` (optional): Result page offset.
  - `sort` (optional): Sort by `price` or `shipping_limit_date` (default).

#### Example

```bash
curl -u seller_id:seller_zip_code_prefix http://localhost:3000/order_items?limit=20&offset=0&sort=price
```

### 2. Delete Order Item

- **Endpoint**: `/order_items/:id`
- **Method**: `DELETE`

#### Example

```bash
curl -u seller_id:seller_zip_code_prefix -X DELETE http://localhost:3000/order_items/12345
```

### 3. Update Seller's City or/and State

- **Endpoint**: `/account`
- **Method**: `PUT`

#### Example

```bash
curl -u seller_id:seller_zip_code_prefix -X PUT -d '{"city": "New City", "state": "NS"}' http://localhost:3000/account
```

## Testing

Run tests using:

```bash
npm test
```

## Linting

Lint the code with:

```bash
npm run lint
```

## Contributing

Feel free to open issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
