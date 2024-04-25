import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main()
{
  let message: string;
  console.log("start seed");
  console.log("");

  message = await createAllArchivement();
  console.log(message);
  console.log("");

  message = await createDefaultUsers();
  console.log(message);
  console.log("");
  
  message = await createDefaultChannels();
  console.log(message);
  console.log("");
  
  message = await createIsMermbersOf();
  console.log(message);
  console.log("");
  
  message = await createGames();
  console.log(message);
  console.log("");
  
  message = await createArchivementDone();
  console.log(message);
  console.log("");
  
  message = await createFriends();
  console.log(message);
  console.log("");
  
  message = await createBlocked();
  console.log(message);
  console.log("");
  
  message = await createPrivateMessages();
  console.log(message);
  console.log("");
  
  message = await createChannelMessages();
  console.log(message);
  console.log("");
  
  console.log("seed over");
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function createAllArchivement(): Promise<string>
{
  await createOneArchivement('new Mercenary', 'win a normal game', 'https://i.imgur.com/Yhw92xo.png');
  await createOneArchivement('Mercenary', 'win 10 normal game', 'https://i.imgur.com/CfkfkNz.png');
  await createOneArchivement('veteran Mercenary', 'win 100 normal game', 'https://i.imgur.com/udBhycT.png');
  await createOneArchivement('new Edgerunner', 'win a ranked game', 'https://i.imgur.com/9aPHZHb.png');
  await createOneArchivement('Edgerunner', 'win 10 ranked game', 'https://i.imgur.com/QDlYqKj.png');
  await createOneArchivement('veteran Edgerunner', 'win 100 ranked game', 'https://i.imgur.com/VkKIn5o.png');
  await createOneArchivement('rising Legend', 'hit the top 7', 'https://i.imgur.com/GnRFAGU.png');
  await createOneArchivement('Nighticity Legend', 'hit the top 3', 'https://i.imgur.com/D4ZqtKp.png');
  await createOneArchivement('welcome to the afterlife', 'join a channel', 'https://i.imgur.com/d0iXBb5.png');
  await createOneArchivement('vip', 'become an admin of channel or create you\'r own', 'https://i.imgur.com/4QKMo3W.png');
  await createOneArchivement('partner', 'become friend with someone', 'https://i.imgur.com/J9AHlJs.png');
  
  return "all archivements created";
}

async function createDefaultUsers(): Promise<string>
{
  await createOneUser('Rogue.Amendiares@afterlife.com', 'Rogue', 'Amendiares', 'Rogue', 'https://i.imgur.com/NHxt55K.jpg', 5500, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('saburo.arasaka@arasaka.com', 'Saburo', 'Arasaka', 'Saburo Arasaka', 'https://i.imgur.com/Tojsf0a.jpg', 4900, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('mama.welles@coyotecojo.com', 'Guadalupe Alejandra', 'Welles', 'Mama Welles', 'https://i.imgur.com/0MRl60L.jpg', 4200, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('alice@42.fr', '', 'Alice', '@lice', 'https://i.imgur.com/sSRAn9E.jpg', 1086, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 1);
  await createOneUser('bob@42.fr', '', 'Bob', 'Bob', 'https://i.imgur.com/detbUfK.jpg', 1077, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('charlie@42.fr', 'Chalie', 'Chalie', 'Chalie', 'https://i.imgur.com/lBtG15e.jpg', 1042, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('deku@42.fr', 'Izuku', 'Midoriya', 'Deku', 'https://i.imgur.com/Dsosskp.jpg', 1018, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('correction1@42.fr', 'correction1', 'correction1', 'correction1', 'https://i.imgur.com/5T0p5kr.jpg', 1000, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  await createOneUser('correction2@42.fr', 'correction2', 'correction2', 'correction2', 'https://i.imgur.com/5T0p5kr.jpg', 1000, '$2a$10$SPudBGQ5CbaXYTgbWdE4DeEZI9WbxJoVW2XGvPWqpbuwR4Aqxe0AK', '$2a$10$SPudBGQ5CbaXYTgbWdE4De', null, null, 0);
  
  return "all users created";
}

async function createDefaultChannels(): Promise<string>
{
  let date: Date;

  date = new Date(2020, 10, 1, 2, 30, 0, 0); // 2020-11-1 2:30:00
  await createOneChannel(1, 'Afterlife', 'https://i.imgur.com/hLKqjhc.jpg', true, '', '', date);
  await createOneisMemberOf(1, 1, 'OWNER', date)

  date = new Date(2020, 11, 10, 15, 30, 0, 0); // 2020-12-10 8:30:00
  await createOneChannel(2, 'Arasaka', 'https://i.imgur.com/kY7FmhN.jpg', false, '$2b$10$5pk0fddsT7J8rQszLOCS3e7UgNZdHlstQ9QDu6jTe9/KbgtHWqyCC', '$2b$10$5pk0fddsT7J8rQszLOCS3e', date); // !!! MDP
  await createOneisMemberOf(2, 2,'OWNER', date)
  
  date = new Date(2021, 9, 12, 21, 30, 0, 0); // 2021-10-12 21:30:00
  await createOneChannel(3, 'El Coyote Cojo', 'https://i.imgur.com/ZGhItRg.jpg', false, '', '', date);
  await createOneisMemberOf(3, 3, 'OWNER', date)

  return "all channels created";
}

async function createIsMermbersOf(): Promise<string>
{
  await createOneisMemberOf(2, 1, 'BANNED', new Date(2020, 11, 11, 3, 0, 0, 0));
  await createOneisMemberOf(2, 3, 'BANNED', new Date(2021, 9, 12, 21, 45, 0, 0));
  await createOneisMemberOf(1, 3, 'MEMBER', new Date(2021, 11, 17, 18, 45, 0, 0));
  await createOneisMemberOf(3, 1, 'MEMBER', new Date(2021, 11, 17, 14, 30, 0, 0));
  await createOneisMemberOf(4, 1, 'ADMIN', new Date());
  await createOneisMemberOf(4, 3, 'MEMBER', new Date());
  await createOneisMemberOf(5, 1, 'BANNED', new Date());
  await createOneisMemberOf(5, 2, 'MEMBER', new Date());
  await createOneisMemberOf(5, 3, 'MUTED', new Date());
  await createOneisMemberOf(6, 1, 'MEMBER', new Date());
  await createOneisMemberOf(6, 3, 'ADMIN', new Date());
  await createOneisMemberOf(7, 2, 'BANNED', new Date());
  await createOneisMemberOf(7, 3, 'MEMBER', new Date());
  await createOneisMemberOf(9, 1, 'INVITED', new Date());

  return "all isMemberOf created";
}

async function createGames(): Promise<string>
{
  await createOneGame(1, 1, 2, true, 18, 12, true, new Date());
  await createOneGame(2, 1, 3, true, 27, 2, true, new Date());
  await createOneGame(3, 4, 2, true, 14, 16, true, new Date());
  await createOneGame(4, 6, 1, true, 5, 12, true, new Date());
  await createOneGame(5, 4, 1, true, 3, 14, true, new Date());
  await createOneGame(6, 5, 6, false, 12, 14, true, new Date());
  await createOneGame(7, 4, 1, true, 12, 16, true, new Date());
  await createOneGame(8, 2, 3, false, 14, 6, true, new Date());
  await createOneGame(9, 5, 1, true, 10, 17, true, new Date());
  await createOneGame(10, 4, 6, false, 12, 9, true, new Date());
  await createOneGame(11, 4, 7, false, 18, 6, true, new Date());
  await createOneGame(12, 1, 7, true, 11, 10, true, new Date());
  await createOneGame(13, 5, 2, false, 14, 18, true, new Date());
  await createOneGame(14, 4, 7, false, 17, 6, true, new Date());
  await createOneGame(15, 2, 1, true, 7, 19, true, new Date());
  await createOneGame(16, 7, 3, false, 15, 16, true, new Date());
  await createOneGame(17, 7, 2, false, 5, 6, true, new Date());
  await createOneGame(18, 6, 2, true, 11, 8, true, new Date());
  await createOneGame(19, 2, 5, true, 10, 10, true, new Date());
  await createOneGame(20, 6, 4, false, 11, 11, true, new Date());
  await createOneGame(21, 3, 5, true, 5, 5, true, new Date());
  await createOneGame(22, 5, 3, true, 7, 6, true, new Date());
  await createOneGame(23, 3, 4, true, 10, 10, true, new Date());
  await createOneGame(24, 5, 4, false, 12, 15, true, new Date());
  await createOneGame(25, 7, 5, true, 11, 11, true, new Date());
  await createOneGame(26, 2, 6, false, 21, 0, true, new Date());
  await createOneGame(27, 5, 3, false, 17, 5, true, new Date());
  await createOneGame(28, 3, 6, false, 11, 7, true, new Date());
  await createOneGame(29, 6, 4, false, 12, 11, true, new Date());
  await createOneGame(30, 7, 3, true, 9, 9, true, new Date());
  await createOneGame(31, 7, 5, false, 11, 13, true, new Date());
  await createOneGame(32, 1, 3, false, 25, 7, true, new Date());
  await createOneGame(33, 1, 2, true, 24, 4, true, new Date());
  await createOneGame(34, 7, 6, true, 17, 9, true, new Date());
  await createOneGame(35, 6, 7, false, 12, 13, true, new Date());
  await createOneGame(36, 1, 9, false, 15, 15, true, new Date());

  return "all games created";
}

async function createArchivementDone(): Promise<string>
{
  await createOneArchivementDone(1, 1, new Date());
  await createOneArchivementDone(1, 2, new Date());
  await createOneArchivementDone(1, 3, new Date());
  await createOneArchivementDone(1, 4, new Date());
  await createOneArchivementDone(1, 5, new Date());
  await createOneArchivementDone(1, 6, new Date());
  await createOneArchivementDone(1, 7, new Date());
  await createOneArchivementDone(1, 8, new Date());
  await createOneArchivementDone(1, 9, new Date());
  await createOneArchivementDone(1, 10, new Date());

  await createOneArchivementDone(2, 1, new Date());
  await createOneArchivementDone(2, 2, new Date());
  await createOneArchivementDone(2, 3, new Date());
  await createOneArchivementDone(2, 4, new Date());
  await createOneArchivementDone(2, 5, new Date());
  await createOneArchivementDone(2, 6, new Date());
  await createOneArchivementDone(2, 7, new Date());
  await createOneArchivementDone(2, 8, new Date());
  await createOneArchivementDone(2, 9, new Date());
  await createOneArchivementDone(2, 10, new Date());

  await createOneArchivementDone(3, 1, new Date());
  await createOneArchivementDone(3, 2, new Date());
  await createOneArchivementDone(3, 4, new Date());
  await createOneArchivementDone(3, 5, new Date());
  await createOneArchivementDone(3, 7, new Date());
  await createOneArchivementDone(3, 8, new Date());
  await createOneArchivementDone(3, 9, new Date());
  await createOneArchivementDone(3, 10, new Date());

  await createOneArchivementDone(4, 1, new Date());
  await createOneArchivementDone(4, 2, new Date());
  await createOneArchivementDone(4, 4, new Date());
  await createOneArchivementDone(4, 5, new Date());
  await createOneArchivementDone(4, 7, new Date());
  await createOneArchivementDone(4, 9, new Date());
  await createOneArchivementDone(4, 10, new Date());

  await createOneArchivementDone(5, 1, new Date());
  await createOneArchivementDone(5, 2, new Date());
  await createOneArchivementDone(5, 4, new Date());
  await createOneArchivementDone(5, 5, new Date());
  await createOneArchivementDone(5, 7, new Date());
  await createOneArchivementDone(5, 9, new Date());

  await createOneArchivementDone(6, 1, new Date());
  await createOneArchivementDone(6, 2, new Date());
  await createOneArchivementDone(6, 4, new Date());
  await createOneArchivementDone(6, 5, new Date());
  await createOneArchivementDone(6, 7, new Date());
  await createOneArchivementDone(6, 9, new Date());
  await createOneArchivementDone(6, 10, new Date());

  await createOneArchivementDone(7, 1, new Date());
  await createOneArchivementDone(7, 2, new Date());
  await createOneArchivementDone(7, 4, new Date());
  await createOneArchivementDone(7, 5, new Date());
  await createOneArchivementDone(7, 7, new Date());
  await createOneArchivementDone(7, 9, new Date());

  return "all archivementsDone created";
}

async function createFriends(): Promise<string>
{
  await createOneFriend(1, 3, true);
  await createOneFriend(4, 1, true);
  await createOneFriend(6, 1, true);
  await createOneFriend(1, 9, false);
  await createOneFriend(2, 5, true);
  await createOneFriend(3, 4, true);
  await createOneFriend(6, 3, true);
  await createOneFriend(7, 3, true);
  await createOneFriend(4, 6, true);
  await createOneFriend(4, 7, false);
  await createOneFriend(6, 7, false);

  return "all friends created";
}

async function createBlocked(): Promise<string>
{
  await createOneBlocked(1, 2);
  await createOneBlocked(1, 5);
  await createOneBlocked(2, 1);
  await createOneBlocked(2, 3);
  await createOneBlocked(2, 7);
  await createOneBlocked(3, 2);
  await createOneBlocked(5, 3);

  return "all blocked created";
}

async function createPrivateMessages(): Promise<string>
{
  // await createOnePrivateMessage(0, 0, new Date(), '');

  return "all privateMessages created";
}

async function createChannelMessages(): Promise<string>
{
  // await createOneChannelMessage(0, 0, new Date(), '');

  return "all channelMessages created";
}

async function createOneArchivement(
  name: string,
  description: string,
  pathImg: string)
{
  const newArchivement = await prisma.archivement.upsert(
  {
    where:
    {
      name: name,
    },
    update: {},
    create:
    {
      name: name,
      description: description,
      pathImg: pathImg
    },
  });
  console.log({newArchivement});
}

async function createOneUser(
  email: string, 
  name: string,
  surname: string,
  nickname: string,
  avatarPath: string, 
  elo: number,
  salted_password: string,
  salt: string,
  googleAuthLink: string,
  oAuth42Link: string,
  admin: number)
{
  const newUser = await prisma.user.upsert(
  {
    where:
    {
      email: email,
    },
    update: {},
    create:
    {
      email: email,
      name: name,
      surname: surname,
      nickname: nickname,
      pathAvatar: avatarPath,
      elo: Number(elo),
      password:
      {
        create:
        {
          salted_password: salted_password,
          salt: salt,
          googleAuthLink: googleAuthLink,
          oAuth42Link: oAuth42Link,
        },
      },
	    admin: Number(admin),
    },
  });
  console.log({newUser});
}

async function createOneChannel(
  id: number,
  name: string,
  pathImg: string,
  privacy: boolean,
  password: string,
  salt: string,
  creationDate: Date)
{
  const newChannel = await prisma.channel.upsert(
  {
    where: 
    {
      id: Number(id),
      name: name,
    },
    update: {},
    create:
    {
      name: name,
      pathImage: pathImg,
      privacy: Boolean(privacy),
      password: password,
      salt: salt,
      creation: creationDate,
    },
  });
  console.log({newChannel});
}

async function createOneisMemberOf(
  userId: number,
  channelId: number,
  status: string,
  date: Date)
{
  const newisMemberOf = await prisma.isMemberOf.upsert(
  {
    where:
    {
      userId_channelId:
      {
        userId: Number(userId),
        channelId: Number(channelId),
      },
    },
    update: {},
    create:
    {
      userId: Number(userId),
      channelId: Number(channelId),
      status: status,
      dateJoined: date,
    },
  });
  console.log({newisMemberOf});
}

async function createOneGame(
  id: number,
  userId1: number,
  userId2: number,
  isRanked: boolean,
  scoreUser1: number,
  scoreUser2: number,
  isOver: boolean,
  date: Date)
{
  const newGame = await prisma.game.upsert(
  {
    where:
    {
      id: Number(id),
    },
    update: {},
    create:
    {
      userId1: Number(userId1),
      userId2: Number(userId2),
      isRanked: Boolean(isRanked),
      scoreUser1: Number(scoreUser1),
      scoreUser2: Number(scoreUser2),
      isOver: Boolean(isOver),
      date: date,
    },
  });
  console.log({newGame});
}

async function createOneArchivementDone(
  userId: number,
  archivementId: number,
  date: Date)
{
  const newArchivementDone = await prisma.archivementDone.upsert(
  {
    where:
    {
      userId_archivementId:
      {
        userId: Number(userId),
        archivementId: Number(archivementId),
      },
    },
    update: {},
    create:
    {
      userId: Number(userId),
      archivementId: Number(archivementId),
      date: date,
    },
  });
  console.log({newArchivementDone});
}

async function createOneFriend(
  userId1: number,
  userId2: number,
  accepted: boolean)
{
  const newFriend = await prisma.friend.upsert(
  {
    where:
    {
      userId1_userId2:
      {
        userId1: Number(userId1),
        userId2: Number(userId2),
      },
    },
    update: {},
    create:
    {
      userId1: Number(userId1),
      userId2: Number(userId2),
      accepted: Boolean(accepted),
    },
  });
  console.log({newFriend});
}

async function createOneBlocked(
  userId1: number,
  userId2: number)
{
  const newBlocked = await prisma.blocked.upsert(
  {
    where:
    {
      userId1_userId2:
      {
        userId1: Number(userId1),
        userId2: Number(userId2),
      },
    },
    update: {},
    create:
    {
      userId1: Number(userId1),
      userId2: Number(userId2),
    },
  });
  console.log({newBlocked});
}

async function createOnePrivateMessage(
  userId1: number,
  userId2: number,
  date: Date,
  content: string)
{
  const newPrivateMessage = await prisma.privateMessage.upsert(
  {
    where:
    {
      userId1_userId2_date:
      {
        userId1: Number(userId1),
        userId2: Number(userId2),
        date: date,
      },
    },
    update: {},
    create:
    {
      userId1: Number(userId1),
      userId2: Number(userId2),
      date: date,
      content: content,
    },
  });
  console.log({newPrivateMessage});
}

async function createOneChannelMessage(
  userId: number,
  channelId: number,
  date: Date,
  content: string)
{
  const newChannelMessage = await prisma.channelMessage.upsert(
  {
    where:
    {
      userId_channelId_date:
      {
        userId: Number(userId),
        channelId: Number(channelId),
        date: date,
      },
    },
    update: {},
    create:
    {
      userId: Number(userId),
      channelId: Number(channelId),
      date: date,
      content: content,
    },
  });
  console.log({newChannelMessage});
}
