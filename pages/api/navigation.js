// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'path'
import { promises as fs } from 'fs'
import parseMD from 'parse-md'

export default async function handler(req, res) {
  const directory = path.join(process.cwd(), 'app/(prototypes)');
  let prototypes = await fs.readdir(directory, {withFileType: true});
  prototypes = prototypes.filter((val) => !val.startsWith('.'));
  const prototype_data = await Promise.all(prototypes.map(async (folder) => {
    let file = path.join(directory, folder, 'documentation.md');
    try{
      await fs.access(file, fs.F_OK)
      const mkdown = await fs.readFile(file, 'utf8')
      const { metadata, content } = parseMD(mkdown);
      return ([
        folder,
        {
          title: ("title" in metadata ? metadata.title : folder),
          description: ("description" in metadata ? metadata.description : '')
        }
      ])

    } catch {
      return ([
        folder,
        {
          title: folder,
          description: ''
        }
      ])
    }
  }))
  let data = Object.fromEntries(prototype_data);

  res.status(200).json({ data: data, keys: prototypes });
}
