const express = require('express');
const mssql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        enableArithAbort: true,
    }
};

// ---------- UTIL: cerrar conexión si está abierta ----------
async function safeClose() {
    try {
        await mssql.close();
    } catch (e) {
        // no hacemos nada; sólo intentamos cerrar
    }
}

// ---------- BANDAS ----------
app.get('/bandas', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM bandas`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/bandas/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM bandas
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/bandas/crear', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO bandas (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        // Devolvemos el objeto creado (para que Retrofit lo parseé como Bandas si así está definido)
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/bandas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        // Obtener registro antes de borrar
        const selectRes = await mssql.query`SELECT * FROM bandas WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];

        const result = await mssql.query`DELETE FROM bandas WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- BOBINAS ----------
app.get('/bobinas', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM bobinas`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/bobinas/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM bobinas
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/bobinas', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO bobinas (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/bobinas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM bobinas WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM bobinas WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- CABLES_BUJIA ----------
app.get('/cables_bujia', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM cables_bujia`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/cables_bujia/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM cables_bujia
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/cables_bujia', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO cables_bujia (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/cables_bujia/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM cables_bujia WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM cables_bujia WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- CUERPO_VALVULAS ----------
app.get('/cuerpo_valvulas', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM cuerpo_valvulas`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/cuerpo_valvulas/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM cuerpo_valvulas
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/cuerpo_valvulas', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO cuerpo_valvulas (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/cuerpo_valvulas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM cuerpo_valvulas WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM cuerpo_valvulas WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- DEPOSITO_ANTICONGELANTE ----------
app.get('/deposito_anticongelante', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM deposito_anticongelante`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/deposito_anticongelante/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM deposito_anticongelante
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/deposito_anticongelante', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO deposito_anticongelante (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/deposito_anticongelante/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM deposito_anticongelante WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM deposito_anticongelante WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- EMBRAGUE ----------
app.get('/embrague', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM embrague`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/embrague/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM embrague
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/embrague', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO embrague (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/embrague/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM embrague WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM embrague WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- FILTRO_ACEITE ----------
app.get('/filtro_aceite', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM filtro_aceite`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/filtro_aceite/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM filtro_aceite
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/filtro_aceite', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO filtro_aceite (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/filtro_aceite/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM filtro_aceite WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM filtro_aceite WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- FILTRO_AIRE ----------
app.get('/filtro_aire', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM filtro_aire`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/filtro_aire/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM filtro_aire
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/filtro_aire', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO filtro_aire (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/filtro_aire/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM filtro_aire WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM filtro_aire WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- HORQUILLAS ----------
app.get('/horquillas', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM horquillas`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/horquillas/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM horquillas
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/horquillas', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO horquillas (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/horquillas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM horquillas WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM horquillas WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- KIT_ARRANQUE ----------
app.get('/kit_arranque', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM kit_arranque`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/kit_arranque/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM kit_arranque
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/kit_arranque', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO kit_arranque (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/kit_arranque/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM kit_arranque WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM kit_arranque WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- MECATRONICA ----------
app.get('/mecatronica', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM mecatronica`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/mecatronica/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM mecatronica
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/mecatronica', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO mecatronica (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/mecatronica/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM mecatronica WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM mecatronica WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- OTRAS_REFACCIONES ----------
app.get('/otras_refacciones', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM otras_refacciones`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/otras_refacciones/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM otras_refacciones
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/otras_refacciones', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO otras_refacciones (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/otras_refacciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM otras_refacciones WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM otras_refacciones WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- PALANCA_VELOCIDADES ----------
app.get('/palanca_velocidades', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM palanca_velocidades`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/palanca_velocidades/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM palanca_velocidades
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/palanca_velocidades', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO palanca_velocidades (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/palanca_velocidades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM palanca_velocidades WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM palanca_velocidades WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- PROD_GASOLINA ----------
app.get('/prod_gasolina', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM prod_gasolina`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/prod_gasolina/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM prod_gasolina
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/prod_gasolina', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO prod_gasolina (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/prod_gasolina/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM prod_gasolina WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM prod_gasolina WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- RETENES_ARNESES ----------
app.get('/retenes_arneses', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM retenes_arneses`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/retenes_arneses/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM retenes_arneses
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/retenes_arneses', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO retenes_arneses (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/retenes_arneses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM retenes_arneses WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM retenes_arneses WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- TCM ----------
app.get('/tcm', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM tcm`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/tcm/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM tcm
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/tcm', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO tcm (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/tcm/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM tcm WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM tcm WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- VENTILADOR ----------
app.get('/ventilador', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM ventilador`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/ventilador/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM ventilador
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/ventilador', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO ventilador (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/ventilador/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM ventilador WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM ventilador WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// ---------- VOLANTE_BIMASA ----------
app.get('/volante_bimasa', async (req, res) => {
    try {
        await mssql.connect(config);
        const result = await mssql.query`SELECT * FROM volante_bimasa`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.get('/volante_bimasa/buscar', async (req, res) => {
    const searchText = `%${req.query.text}%`;
    try {
        await mssql.connect(config);
        const result = await mssql.query`
            SELECT * FROM volante_bimasa
            WHERE id LIKE ${searchText} OR [descripción] LIKE ${searchText}
        `;
        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.post('/volante_bimasa', async (req, res) => {
    const { id, descripción, cantidad, condición, ubicación } = req.body;
    try {
        await mssql.connect(config);
        await mssql.query`
            INSERT INTO volante_bimasa (id, [descripción], cantidad, [condición], [ubicación])
            VALUES (${id}, ${descripción}, ${cantidad}, ${condición}, ${ubicación})
        `;
        res.status(201).json({ id, descripción, cantidad, condición, ubicación });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

app.delete('/volante_bimasa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await mssql.connect(config);
        const selectRes = await mssql.query`SELECT * FROM volante_bimasa WHERE id = ${id}`;
        if (selectRes.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró el registro con ese ID' });
        }
        const deleted = selectRes.recordset[0];
        const result = await mssql.query`DELETE FROM volante_bimasa WHERE id = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.json(deleted);
        } else {
            res.status(500).json({ message: 'No se pudo eliminar el registro' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await safeClose();
    }
});

// -------------------- FIN RUTAS --------------------

// Puerto en el que el servidor escuchará
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
