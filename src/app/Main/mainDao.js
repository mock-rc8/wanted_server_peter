//
async function selectMain(connection, tag) {

  let mainResultArray = [];
  //console.log('mainDao에서 tag: ', tag);
  if(!tag){
    const selectContentsQuery = `
    SELECT *
    FROM (SELECT contentsIdx, title, introduction, thumbnailUrl, type, link, tag, creator, status
    FROM Contents
    ORDER BY RAND()) contents
    WHERE contents.status = 'active'
    LIMIT 8;
  `;
    const [contentsRows] = await connection.query(selectContentsQuery);
    mainResultArray.push(contentsRows);
  }
  else{
    const selectContentsQuery = `
    SELECT *
    FROM (SELECT contentsIdx, title, introduction, thumbnailUrl, type, link, tag, creator, status
    FROM Contents
    ORDER BY RAND()) contents
    WHERE contents.status = 'active' AND contents.tag =?
    LIMIT 8;
  `;
    const [contentsRows] = await connection.query(selectContentsQuery, tag);
    mainResultArray.push(contentsRows);
  }
  //console.log('contentsRows 타입: ', typeof mainResultArray[0]);

  const selectWantedContentsQuery = `
    SELECT *
FROM
  (SELECT wantedContentsIdx, title, thumbnailUrl, type, tag1, link, status
  FROM wantedContents
  ORDER BY RAND())WC
  WHERE WC.status = 'active'
  LIMIT 4;
  `;
  const selectWantedPlusQuery = `
      SELECT *
  FROM (SELECT wantedPlusIdx, name, title, introduction, thumbnailUrl, tag, status
  FROM wantedPlus
  ORDER BY RAND()) WP
  WHERE WP.status = 'active'
  LIMIT 4;
  `;
  const selectContentsTwoQuery = `
  SELECT * FROM
  (SELECT wantedContentsIdx, title, thumbnailUrl, type, isOnline, endDate, link, status
  FROM wantedContents
  ORDER BY RAND())WC
  WHERE WC.status = 'active'
  LIMIT 2;
  `;

  const [wantedContentsRows] = await connection.query(selectWantedContentsQuery);
  mainResultArray.push(wantedContentsRows);
  const [wantedPlusRows] = await connection.query(selectWantedPlusQuery);
  mainResultArray.push(wantedPlusRows);
  const [contentsTwoRows] = await connection.query(selectContentsTwoQuery);
  mainResultArray.push(contentsTwoRows);
  //console.log('mainResultArray 타입: ', typeof mainResultArray);
  return mainResultArray;

}

module.exports = {
  selectMain,
};