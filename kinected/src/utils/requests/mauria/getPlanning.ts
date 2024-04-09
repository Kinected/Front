import { Course } from "@/types/course";

export async function fetchMauriaPlanning(userID: string) {
  const response = await fetch(
    `http://localhost:8000/api/mauria?userID=${userID}`,
  );

  return await response.json();
}

export async function fetchUpdatedMauriaPlanning(
  userID: string,
): Promise<Course[]> {
  const response = await fetch(
    `http://localhost:8000/api/mauria/update?userID=${userID}`,
  );

  const data = await response.json();

  return data.map((course: any) => {
    return {
      ...course,
      classNames: ["calendar_event"],
    };
  });
}
