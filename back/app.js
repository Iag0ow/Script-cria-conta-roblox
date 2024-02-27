const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.get('/scrape/:name', async (req, res) => {
  const url = 'https://www.roblox.com/';

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const day = '#DayDropdown';
    const month = '#MonthDropdown';
    const year = '#YearDropdown';

    await page.select(day, '04');
    await page.select(month, '11');
    await page.select(year, '1990');

    const username = '#signup-username';
    const inputUsernameValue = req.params.name;
    await page.type(username, inputUsernameValue);

    const password = '#signup-password';
    await page.type(password, 'kasmo123');

    const buttonSelector = '#MaleButton';
    await page.click(buttonSelector);

    const signupButtonSelector = '#signup-button';
    await page.evaluate((buttonSelector) => {
      const button = document.querySelector(buttonSelector);
      if (button) {
        button.removeAttribute('disabled');
      }
    }, signupButtonSelector);
    await page.click(signupButtonSelector);
    await page.screenshot({ path: 'example.png', fullPage: true });

    res.json({ message: 'Usuário criado com sucesso!', nome: inputUsernameValue, senha: 'kasmo1234' });
  } catch (error) {
    res.status(500).json({ error: 'O captcha apareceu, faça pelo menos 1 conta manual.', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
