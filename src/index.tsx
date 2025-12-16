import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// API Routes
app.get('/api/pages', async (c) => {
  const token = c.req.query('access_token')
  
  if (!token) {
    return c.json({ error: 'Access token is required' }, 400)
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${token}`
    )
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch pages' }, 500)
  }
})

app.get('/api/posts', async (c) => {
  const pageId = c.req.query('page_id')
  const token = c.req.query('access_token')
  const limit = c.req.query('limit') || '100'
  const after = c.req.query('after') || ''
  
  if (!pageId || !token) {
    return c.json({ error: 'Page ID and access token are required' }, 400)
  }

  try {
    let url = `https://graph.facebook.com/v18.0/${pageId}/posts?limit=${limit}&access_token=${token}`
    if (after) {
      url += `&after=${after}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

app.delete('/api/post/:postId', async (c) => {
  const postId = c.req.param('postId')
  const token = c.req.query('access_token')
  
  if (!token) {
    return c.json({ error: 'Access token is required' }, 400)
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}?access_token=${token}`,
      { method: 'DELETE' }
    )
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

app.get('/api/photos', async (c) => {
  const pageId = c.req.query('page_id')
  const token = c.req.query('access_token')
  const limit = c.req.query('limit') || '100'
  const after = c.req.query('after') || ''
  
  if (!pageId || !token) {
    return c.json({ error: 'Page ID and access token are required' }, 400)
  }

  try {
    let url = `https://graph.facebook.com/v18.0/${pageId}/photos?type=uploaded&limit=${limit}&access_token=${token}`
    if (after) {
      url += `&after=${after}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch photos' }, 500)
  }
})

app.delete('/api/photo/:photoId', async (c) => {
  const photoId = c.req.param('photoId')
  const token = c.req.query('access_token')
  
  if (!token) {
    return c.json({ error: 'Access token is required' }, 400)
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${photoId}?access_token=${token}`,
      { method: 'DELETE' }
    )
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to delete photo' }, 500)
  }
})

app.get('/api/videos', async (c) => {
  const pageId = c.req.query('page_id')
  const token = c.req.query('access_token')
  const limit = c.req.query('limit') || '100'
  const after = c.req.query('after') || ''
  
  if (!pageId || !token) {
    return c.json({ error: 'Page ID and access token are required' }, 400)
  }

  try {
    let url = `https://graph.facebook.com/v18.0/${pageId}/videos?limit=${limit}&access_token=${token}`
    if (after) {
      url += `&after=${after}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch videos' }, 500)
  }
})

app.delete('/api/video/:videoId', async (c) => {
  const videoId = c.req.param('videoId')
  const token = c.req.query('access_token')
  
  if (!token) {
    return c.json({ error: 'Access token is required' }, 400)
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${videoId}?access_token=${token}`,
      { method: 'DELETE' }
    )
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to delete video' }, 500)
  }
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facebook Page Cleaner - ลบข้อมูลเพจ Facebook</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  facebook: '#1877f2',
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fab fa-facebook text-facebook text-4xl"></i>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Facebook Page Cleaner</h1>
                            <p class="text-sm text-gray-600">เครื่องมือลบโพสต์และรูปภาพบนเพจ Facebook</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <!-- Warning Banner -->
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                <div class="flex items-start">
                    <i class="fas fa-exclamation-triangle text-red-500 text-2xl mr-3 mt-1"></i>
                    <div>
                        <h3 class="text-red-800 font-bold text-lg mb-1">คำเตือนสำคัญ!</h3>
                        <p class="text-red-700">
                            เครื่องมือนี้จะลบข้อมูลอย่างถาวร กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ 
                            และควรทำสำรองข้อมูลก่อนใช้งาน
                        </p>
                    </div>
                </div>
            </div>

            <!-- Step 1: Access Token -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="bg-facebook text-white rounded-full w-8 h-8 flex items-center justify-center">1</span>
                    ใส่ Access Token
                </h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            User Access Token
                            <a href="https://developers.facebook.com/tools/explorer/" 
                               target="_blank" 
                               class="text-blue-600 hover:underline ml-2">
                                (รับ Token ที่นี่)
                            </a>
                        </label>
                        <input 
                            type="text" 
                            id="accessToken" 
                            placeholder="ใส่ User Access Token ของคุณ"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-facebook focus:border-transparent">
                        <p class="text-xs text-gray-500 mt-2">
                            <i class="fas fa-info-circle"></i>
                            ต้องมี permissions: pages_manage_posts, pages_read_engagement, pages_show_list
                        </p>
                    </div>
                    <button 
                        onclick="loadPages()" 
                        class="bg-facebook text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                        <i class="fas fa-sync-alt mr-2"></i>
                        โหลดรายชื่อเพจ
                    </button>
                </div>
            </div>

            <!-- Step 2: Select Page -->
            <div id="pageSection" class="bg-white rounded-xl shadow-lg p-6 mb-6 hidden">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="bg-facebook text-white rounded-full w-8 h-8 flex items-center justify-center">2</span>
                    เลือกเพจ
                </h2>
                <div id="pagesList" class="space-y-2"></div>
            </div>

            <!-- Step 3: Select Action -->
            <div id="actionSection" class="bg-white rounded-xl shadow-lg p-6 mb-6 hidden">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="bg-facebook text-white rounded-full w-8 h-8 flex items-center justify-center">3</span>
                    เลือกการดำเนินการ
                </h2>
                <div class="grid md:grid-cols-3 gap-4">
                    <button 
                        onclick="startDeletePosts()" 
                        class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg hover:from-red-600 hover:to-red-700 transition shadow-lg transform hover:scale-105">
                        <i class="fas fa-file-alt text-3xl mb-2"></i>
                        <h3 class="font-bold text-lg">ลบโพสต์ทั้งหมด</h3>
                        <p class="text-sm opacity-90 mt-1">Delete all posts</p>
                    </button>
                    <button 
                        onclick="startDeletePhotos()" 
                        class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-lg transform hover:scale-105">
                        <i class="fas fa-image text-3xl mb-2"></i>
                        <h3 class="font-bold text-lg">ลบรูปภาพทั้งหมด</h3>
                        <p class="text-sm opacity-90 mt-1">Delete all photos</p>
                    </button>
                    <button 
                        onclick="startDeleteVideos()" 
                        class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg transform hover:scale-105">
                        <i class="fas fa-video text-3xl mb-2"></i>
                        <h3 class="font-bold text-lg">ลบวิดีโอทั้งหมด</h3>
                        <p class="text-sm opacity-90 mt-1">Delete all videos</p>
                    </button>
                </div>
            </div>

            <!-- Progress Section -->
            <div id="progressSection" class="bg-white rounded-xl shadow-lg p-6 hidden">
                <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i class="fas fa-tasks text-facebook"></i>
                    ความคืบหน้า
                </h2>
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span id="progressText">กำลังประมวลผล...</span>
                        <span id="progressPercent">0%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div id="progressBar" class="bg-facebook h-4 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
                <div class="grid md:grid-cols-3 gap-4 mb-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-sm text-gray-600">ทั้งหมด</div>
                        <div class="text-2xl font-bold text-blue-600" id="totalCount">0</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <div class="text-sm text-gray-600">สำเร็จ</div>
                        <div class="text-2xl font-bold text-green-600" id="successCount">0</div>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg">
                        <div class="text-sm text-gray-600">ล้มเหลว</div>
                        <div class="text-2xl font-bold text-red-600" id="failedCount">0</div>
                    </div>
                </div>
                <div id="logContainer" class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm font-mono">
                    <div id="logs"></div>
                </div>
                <button 
                    onclick="stopOperation()" 
                    id="stopButton"
                    class="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                    <i class="fas fa-stop mr-2"></i>
                    หยุดการทำงาน
                </button>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white mt-12 py-6 border-t">
            <div class="container mx-auto px-4 text-center text-gray-600">
                <p class="mb-2">
                    <i class="fas fa-shield-alt text-facebook"></i>
                    ข้อมูลของคุณปลอดภัย - เราไม่เก็บ Access Token หรือข้อมูลใดๆ
                </p>
                <p class="text-sm">
                    สร้างด้วย Hono + Cloudflare Workers | 
                    <a href="https://github.com" class="text-facebook hover:underline">GitHub</a>
                </p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            let selectedPage = null;
            let pageAccessToken = null;
            let isOperating = false;
            let shouldStop = false;

            function addLog(message, type = 'info') {
                const logs = document.getElementById('logs');
                const time = new Date().toLocaleTimeString('th-TH');
                const colors = {
                    info: 'text-blue-600',
                    success: 'text-green-600',
                    error: 'text-red-600',
                    warning: 'text-orange-600'
                };
                const icons = {
                    info: 'fa-info-circle',
                    success: 'fa-check-circle',
                    error: 'fa-times-circle',
                    warning: 'fa-exclamation-triangle'
                };
                logs.innerHTML += \`<div class="\${colors[type]}"><i class="fas \${icons[type]}"></i> [\${time}] \${message}</div>\`;
                logs.parentElement.scrollTop = logs.parentElement.scrollHeight;
            }

            function updateProgress(current, total) {
                const percent = total > 0 ? Math.round((current / total) * 100) : 0;
                document.getElementById('progressBar').style.width = percent + '%';
                document.getElementById('progressPercent').textContent = percent + '%';
                document.getElementById('progressText').textContent = \`กำลังประมวลผล... (\${current}/\${total})\`;
            }

            async function loadPages() {
                const token = document.getElementById('accessToken').value.trim();
                if (!token) {
                    alert('กรุณาใส่ Access Token');
                    return;
                }

                try {
                    addLog('กำลังโหลดรายชื่อเพจ...', 'info');
                    const response = await axios.get(\`/api/pages?access_token=\${encodeURIComponent(token)}\`);
                    
                    if (response.data.error) {
                        throw new Error(response.data.error.message);
                    }

                    const pages = response.data.data || [];
                    if (pages.length === 0) {
                        alert('ไม่พบเพจที่คุณดูแล');
                        return;
                    }

                    const pagesList = document.getElementById('pagesList');
                    pagesList.innerHTML = '';
                    
                    pages.forEach(page => {
                        const div = document.createElement('div');
                        div.className = 'border border-gray-200 rounded-lg p-4 hover:border-facebook hover:bg-blue-50 cursor-pointer transition';
                        div.innerHTML = \`
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-bold text-gray-800">\${page.name}</h3>
                                    <p class="text-sm text-gray-600">ID: \${page.id}</p>
                                </div>
                                <i class="fas fa-chevron-right text-gray-400"></i>
                            </div>
                        \`;
                        div.onclick = () => selectPage(page);
                        pagesList.appendChild(div);
                    });

                    document.getElementById('pageSection').classList.remove('hidden');
                    addLog(\`พบ \${pages.length} เพจ\`, 'success');
                } catch (error) {
                    alert('เกิดข้อผิดพลาด: ' + error.message);
                    addLog('Error: ' + error.message, 'error');
                }
            }

            function selectPage(page) {
                selectedPage = page;
                pageAccessToken = page.access_token;
                
                document.querySelectorAll('#pagesList > div').forEach(el => {
                    el.classList.remove('border-facebook', 'bg-blue-50');
                });
                event.currentTarget.classList.add('border-facebook', 'bg-blue-50');
                
                document.getElementById('actionSection').classList.remove('hidden');
                addLog(\`เลือกเพจ: \${page.name}\`, 'success');
            }

            async function startDeletePosts() {
                if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์ทั้งหมด? การดำเนินการนี้ไม่สามารถยกเลิกได้!')) {
                    return;
                }

                isOperating = true;
                shouldStop = false;
                document.getElementById('progressSection').classList.remove('hidden');
                document.getElementById('logs').innerHTML = '';
                document.getElementById('successCount').textContent = '0';
                document.getElementById('failedCount').textContent = '0';

                addLog('เริ่มลบโพสต์...', 'info');

                let successCount = 0;
                let failedCount = 0;
                let processedCount = 0;
                let hasMore = true;
                let after = '';

                try {
                    while (hasMore && !shouldStop) {
                        const response = await axios.get(\`/api/posts?page_id=\${selectedPage.id}&access_token=\${encodeURIComponent(pageAccessToken)}&limit=100&after=\${after}\`);
                        
                        const posts = response.data.data || [];
                        const paging = response.data.paging || {};
                        
                        if (posts.length === 0) {
                            hasMore = false;
                            break;
                        }

                        const totalPosts = posts.length;
                        document.getElementById('totalCount').textContent = processedCount + totalPosts;

                        for (let i = 0; i < posts.length; i++) {
                            if (shouldStop) break;

                            const post = posts[i];
                            try {
                                const deleteResponse = await axios.delete(
                                    \`/api/post/\${post.id}?access_token=\${encodeURIComponent(pageAccessToken)}\`
                                );

                                if (deleteResponse.data.success) {
                                    successCount++;
                                    addLog(\`✓ ลบโพสต์สำเร็จ: \${post.id}\`, 'success');
                                } else {
                                    failedCount++;
                                    addLog(\`✗ ไม่สามารถลบโพสต์: \${post.id}\`, 'error');
                                }
                            } catch (error) {
                                failedCount++;
                                addLog(\`✗ Error: \${post.id} - \${error.message}\`, 'error');
                            }

                            processedCount++;
                            document.getElementById('successCount').textContent = successCount;
                            document.getElementById('failedCount').textContent = failedCount;
                            updateProgress(processedCount, processedCount);

                            // Rate limiting: delay 100ms between requests
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }

                        if (paging.cursors && paging.cursors.after) {
                            after = paging.cursors.after;
                        } else {
                            hasMore = false;
                        }
                    }

                    if (shouldStop) {
                        addLog('การทำงานถูกหยุดโดยผู้ใช้', 'warning');
                    } else {
                        addLog(\`เสร็จสิ้น! ลบสำเร็จ: \${successCount} รายการ, ล้มเหลว: \${failedCount} รายการ\`, 'success');
                    }
                } catch (error) {
                    addLog('เกิดข้อผิดพลาด: ' + error.message, 'error');
                } finally {
                    isOperating = false;
                }
            }

            async function startDeletePhotos() {
                if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพทั้งหมด? การดำเนินการนี้ไม่สามารถยกเลิกได้!')) {
                    return;
                }

                isOperating = true;
                shouldStop = false;
                document.getElementById('progressSection').classList.remove('hidden');
                document.getElementById('logs').innerHTML = '';
                document.getElementById('successCount').textContent = '0';
                document.getElementById('failedCount').textContent = '0';

                addLog('เริ่มลบรูปภาพ...', 'info');

                let successCount = 0;
                let failedCount = 0;
                let processedCount = 0;
                let hasMore = true;
                let after = '';

                try {
                    while (hasMore && !shouldStop) {
                        const response = await axios.get(\`/api/photos?page_id=\${selectedPage.id}&access_token=\${encodeURIComponent(pageAccessToken)}&limit=100&after=\${after}\`);
                        
                        const photos = response.data.data || [];
                        const paging = response.data.paging || {};
                        
                        if (photos.length === 0) {
                            hasMore = false;
                            break;
                        }

                        const totalPhotos = photos.length;
                        document.getElementById('totalCount').textContent = processedCount + totalPhotos;

                        for (let i = 0; i < photos.length; i++) {
                            if (shouldStop) break;

                            const photo = photos[i];
                            try {
                                const deleteResponse = await axios.delete(
                                    \`/api/photo/\${photo.id}?access_token=\${encodeURIComponent(pageAccessToken)}\`
                                );

                                if (deleteResponse.data.success) {
                                    successCount++;
                                    addLog(\`✓ ลบรูปภาพสำเร็จ: \${photo.id}\`, 'success');
                                } else {
                                    failedCount++;
                                    addLog(\`✗ ไม่สามารถลบรูปภาพ: \${photo.id}\`, 'error');
                                }
                            } catch (error) {
                                failedCount++;
                                addLog(\`✗ Error: \${photo.id} - \${error.message}\`, 'error');
                            }

                            processedCount++;
                            document.getElementById('successCount').textContent = successCount;
                            document.getElementById('failedCount').textContent = failedCount;
                            updateProgress(processedCount, processedCount);

                            await new Promise(resolve => setTimeout(resolve, 100));
                        }

                        if (paging.cursors && paging.cursors.after) {
                            after = paging.cursors.after;
                        } else {
                            hasMore = false;
                        }
                    }

                    if (shouldStop) {
                        addLog('การทำงานถูกหยุดโดยผู้ใช้', 'warning');
                    } else {
                        addLog(\`เสร็จสิ้น! ลบสำเร็จ: \${successCount} รายการ, ล้มเหลว: \${failedCount} รายการ\`, 'success');
                    }
                } catch (error) {
                    addLog('เกิดข้อผิดพลาด: ' + error.message, 'error');
                } finally {
                    isOperating = false;
                }
            }

            async function startDeleteVideos() {
                if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบวิดีโอทั้งหมด? การดำเนินการนี้ไม่สามารถยกเลิกได้!')) {
                    return;
                }

                isOperating = true;
                shouldStop = false;
                document.getElementById('progressSection').classList.remove('hidden');
                document.getElementById('logs').innerHTML = '';
                document.getElementById('successCount').textContent = '0';
                document.getElementById('failedCount').textContent = '0';

                addLog('เริ่มลบวิดีโอ...', 'info');

                let successCount = 0;
                let failedCount = 0;
                let processedCount = 0;
                let hasMore = true;
                let after = '';

                try {
                    while (hasMore && !shouldStop) {
                        const response = await axios.get(\`/api/videos?page_id=\${selectedPage.id}&access_token=\${encodeURIComponent(pageAccessToken)}&limit=100&after=\${after}\`);
                        
                        const videos = response.data.data || [];
                        const paging = response.data.paging || {};
                        
                        if (videos.length === 0) {
                            hasMore = false;
                            break;
                        }

                        const totalVideos = videos.length;
                        document.getElementById('totalCount').textContent = processedCount + totalVideos;

                        for (let i = 0; i < videos.length; i++) {
                            if (shouldStop) break;

                            const video = videos[i];
                            try {
                                const deleteResponse = await axios.delete(
                                    \`/api/video/\${video.id}?access_token=\${encodeURIComponent(pageAccessToken)}\`
                                );

                                if (deleteResponse.data.success) {
                                    successCount++;
                                    addLog(\`✓ ลบวิดีโอสำเร็จ: \${video.id}\`, 'success');
                                } else {
                                    failedCount++;
                                    addLog(\`✗ ไม่สามารถลบวิดีโอ: \${video.id}\`, 'error');
                                }
                            } catch (error) {
                                failedCount++;
                                addLog(\`✗ Error: \${video.id} - \${error.message}\`, 'error');
                            }

                            processedCount++;
                            document.getElementById('successCount').textContent = successCount;
                            document.getElementById('failedCount').textContent = failedCount;
                            updateProgress(processedCount, processedCount);

                            await new Promise(resolve => setTimeout(resolve, 100));
                        }

                        if (paging.cursors && paging.cursors.after) {
                            after = paging.cursors.after;
                        } else {
                            hasMore = false;
                        }
                    }

                    if (shouldStop) {
                        addLog('การทำงานถูกหยุดโดยผู้ใช้', 'warning');
                    } else {
                        addLog(\`เสร็จสิ้น! ลบสำเร็จ: \${successCount} รายการ, ล้มเหลว: \${failedCount} รายการ\`, 'success');
                    }
                } catch (error) {
                    addLog('เกิดข้อผิดพลาด: ' + error.message, 'error');
                } finally {
                    isOperating = false;
                }
            }

            function stopOperation() {
                if (isOperating) {
                    shouldStop = true;
                    addLog('กำลังหยุดการทำงาน...', 'warning');
                }
            }
        </script>
    </body>
    </html>
  `)
})

export default app
