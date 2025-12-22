import LocationFiles from '../../../models/LocationFiles';

export const locationFilesRepository = {
    async saveLocationFiles(filenames: string[], files: Express.Multer.File[]) {
        const locationFilesData = files.map((file, index) => ({
          filename: filenames[index],
          fileSize: file.size,
          fileMimeType: file.mimetype,
        }));

        return LocationFiles.bulkCreate(locationFilesData);
    },
    async deleteByFilename(filename: string) {
        const deleted = await LocationFiles.destroy({ where: { filename } });
        return deleted > 0;
    },
    async associateFilesWithLocation(filenames: string[], locationId: string) {
        await LocationFiles.update(
            { locationId },
            { where: { filename: filenames } }
        );
    },
};